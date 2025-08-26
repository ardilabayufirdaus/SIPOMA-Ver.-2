"use client";

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toaster";

type Row = {
  tanggal: string;
  keluar: number;
  akhir: number;
  diterima?: number;
  dead?: number;
  life?: number;
  ket?: string;
};

export default function EntriDataStokTable() {
  const { addToast } = useToast();
  // --- missing state/refs/helpers (restores component scope) ---
  const now = new Date();
  const SAVE_DEBOUNCE_MS = 600;
  const pad = (n: number) => String(n).padStart(2, "0");
  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();
  // normalize header keys from Excel imports (case-insensitive, space/_ variants)
  const normalizeKey = (k: string) =>
    String(k || "")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  const parseExcelRow = (r: Record<string, any>) => {
    const map: Record<string, any> = {};
    for (const key of Object.keys(r)) {
      map[normalizeKey(key)] = r[key];
    }
    return {
      tanggal: map.tanggal || map.date || map.tgl || map.tanggal_iso || "",
      keluar: Number(map.keluar ?? map.stok_keluar ?? map.out ?? 0),
      akhir: Number(map.akhir ?? map.stok_akhir ?? map.end ?? 0),
      diterima: Number(map.diterima ?? map.stok_diterima ?? map.received ?? 0),
      ket: map.ket ?? map.keterangan ?? map.notes ?? "",
    } as Row;
  };
  const areaPeriodKey = (aId: number | null, y: number, m: number) =>
    `${aId ?? 0}::${y}-${pad(m + 1)}`;

  const [packingAreas, setPackingAreas] = useState<any[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [areaRows, setAreaRows] = useState<Record<string, Row[]>>({});
  const [pendingSaves, setPendingSaves] = useState<Record<string, boolean>>({});
  const [rowStatuses, setRowStatuses] = useState<
    Record<string, Record<string, string>>
  >({});
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveOnImport, setAutoSaveOnImport] = useState(false);
  const [activeDeadStock, setActiveDeadStock] = useState<number | null>(0);
  const [openingAkhirPrev, setOpeningAkhirPrev] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputYearRef = useRef<HTMLInputElement | null>(null);
  const saveTimeoutsRef = useRef<Record<string, any>>({});
  const computeSaveTimeoutRef = useRef<any>(null);

  const currentKey =
    selectedAreaId !== null
      ? areaPeriodKey(selectedAreaId, selectedYear, selectedMonth)
      : "__none";
  const getInitialRows = (y: number, m: number): Row[] => {
    const days = getDaysInMonth(y, m);
    const rows: Row[] = [];
    for (let d = 1; d <= days; d++) {
      rows.push({
        tanggal: `${y}-${pad(m + 1)}-${pad(d)}`,
        keluar: 0,
        akhir: 0,
        diterima: 0,
        dead: activeDeadStock ?? 0,
        life: 0,
        ket: "",
      });
    }
    return rows;
  };

  const currentRows =
    areaRows[currentKey] ?? getInitialRows(selectedYear, selectedMonth);

  const scheduleRowSave = (tanggal: string, row: Row) => {
    if (!selectedAreaId) return;
    const key = `${currentKey}::${tanggal}`;
    if (saveTimeoutsRef.current[key])
      clearTimeout(saveTimeoutsRef.current[key]);
    setRowStatuses((s) => ({
      ...s,
      [currentKey]: { ...(s[currentKey] ?? {}), [tanggal]: "saving" },
    }));
    setPendingSaves((p) => ({ ...p, [currentKey]: true }));
    saveTimeoutsRef.current[key] = setTimeout(async () => {
      try {
        // compute stok_diterima for this row using nearby rows
        const rows =
          areaRows[currentKey] ?? getInitialRows(selectedYear, selectedMonth);
        const idx = rows.findIndex((r) => r.tanggal === tanggal);
        let prevAkhir = 0;
        if (idx === 0) {
          const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
          const prevYear =
            selectedMonth === 0 ? selectedYear - 1 : selectedYear;
          const prevKey = areaPeriodKey(selectedAreaId, prevYear, prevMonth);
          const prevRows = areaRows[prevKey];
          if (prevRows && prevRows.length)
            prevAkhir = Number(prevRows[prevRows.length - 1].akhir ?? 0);
          else prevAkhir = Number(openingAkhirPrev ?? 0);
        } else {
          prevAkhir = Number(rows[idx - 1]?.akhir ?? 0);
        }
        const akhirRaw = row.akhir;
        const keluarRaw = row.keluar;
        const akhir = Number(akhirRaw ?? 0);
        const keluar = Number(keluarRaw ?? 0);
        // if either keluar or akhir is missing, or akhir is zero, set diterima to 0 per requirement
        const diterima =
          akhirRaw == null || keluarRaw == null || Number(akhirRaw) === 0
            ? 0
            : akhir - (prevAkhir - keluar);

        const payload = {
          plant_id: selectedAreaId,
          tanggal: row.tanggal,
          stok_diterima: Number(diterima ?? 0),
          stok_keluar: Number(keluar ?? 0),
          stok_akhir: Number(akhir ?? 0),
          dead_stock: Number(activeDeadStock ?? 0),
          life_stock: Number(akhir ?? 0) - Number(activeDeadStock ?? 0),
          notes: row.ket ?? "",
        } as any;

        const { error } = await supabase
          .from("packing_plant_stock")
          .upsert(payload, { onConflict: "plant_id,tanggal" });
        if (error) throw error;
        setRowStatuses((s) => ({
          ...s,
          [currentKey]: { ...(s[currentKey] ?? {}), [tanggal]: "saved" },
        }));
        setPendingSaves((p) => ({ ...p, [currentKey]: false }));
      } catch (err) {
        console.error(err);
        setRowStatuses((s) => ({
          ...s,
          [currentKey]: { ...(s[currentKey] ?? {}), [tanggal]: "error" },
        }));
        setPendingSaves((p) => ({ ...p, [currentKey]: true }));
        addToast({
          type: "error",
          title: "Simpan baris gagal",
          description: (err as any)?.message ?? String(err),
        });
      } finally {
        delete saveTimeoutsRef.current[key];
      }
    }, SAVE_DEBOUNCE_MS) as any;
  };
  // compute diterima for given rows using previous-period opening if needed
  const computeDiterimaForRows = (rows: Row[]) => {
    return rows.map((r, i, arr) => {
      let prevAkhir: number;
      if (i === 0) {
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        const prevKey = areaPeriodKey(selectedAreaId, prevYear, prevMonth);
        const prevRows = areaRows[prevKey];
        if (prevRows && prevRows.length)
          prevAkhir = Number(prevRows[prevRows.length - 1].akhir ?? 0);
        else prevAkhir = Number(openingAkhirPrev ?? 0);
      } else {
        prevAkhir = arr[i - 1].akhir;
      }
      const akhirRaw = r.akhir;
      const keluarRaw = r.keluar;
      const akhir = Number(akhirRaw ?? 0);
      const keluar = Number(keluarRaw ?? 0);
      // skip calculation when akhir is explicitly 0
      const diterima =
        akhirRaw == null || keluarRaw == null || Number(akhirRaw) === 0
          ? 0
          : akhir - (prevAkhir - keluar);
      return { ...r, diterima };
    });
  };

  const computeAndAutoSaveCurrentPeriod = async (opts?: {
    force?: boolean;
  }) => {
    const rows =
      areaRows[currentKey] ?? getInitialRows(selectedYear, selectedMonth);
    const computed = computeDiterimaForRows(rows);
    // check if any computed diterima differ from current local rows (or force)
    const needsUpdate =
      opts?.force ||
      computed.some(
        (c, i) => Number(c.diterima ?? 0) !== Number(rows[i]?.diterima ?? 0)
      );
    if (!needsUpdate) return;

    // update local state first so UI shows computed values immediately
    setAreaRows((p) => ({ ...p, [currentKey]: computed }));
    setPendingSaves((p) => ({ ...p, [currentKey]: true }));

    // batch upsert to Supabase
    try {
      const payload = computed.map((r, i) => {
        // determine prevAkhir per row for life_stock too
        let prevAkhir = 0;
        if (i === 0) {
          const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
          const prevYear =
            selectedMonth === 0 ? selectedYear - 1 : selectedYear;
          const prevKey = areaPeriodKey(selectedAreaId, prevYear, prevMonth);
          const prevRows = areaRows[prevKey];
          if (prevRows && prevRows.length)
            prevAkhir = Number(prevRows[prevRows.length - 1].akhir ?? 0);
          else prevAkhir = Number(openingAkhirPrev ?? 0);
        } else {
          prevAkhir = Number(computed[i - 1]?.akhir ?? 0);
        }
        const akhirRaw = r.akhir;
        const keluarRaw = r.keluar;
        const akhir = Number(r.akhir ?? 0);
        const keluar = Number(r.keluar ?? 0);
        const diterima =
          akhirRaw == null || keluarRaw == null || Number(akhirRaw) === 0
            ? 0
            : Number(r.diterima ?? 0);
        return {
          plant_id: selectedAreaId,
          tanggal: r.tanggal,
          stok_diterima: diterima,
          stok_keluar: Number(keluar ?? 0),
          stok_akhir: akhir,
          dead_stock: Number(activeDeadStock ?? 0),
          life_stock: Number(akhir ?? 0) - Number(activeDeadStock ?? 0),
          notes: r.ket ?? "",
        } as any;
      });

      // debounce batch upsert to avoid rapid repeated calls
      if (computeSaveTimeoutRef.current)
        clearTimeout(computeSaveTimeoutRef.current);
      await new Promise((res) => {
        computeSaveTimeoutRef.current = setTimeout(async () => {
          try {
            const { error } = await supabase
              .from("packing_plant_stock")
              .upsert(payload, { onConflict: "plant_id,tanggal" });
            if (error) throw error;
            setRowStatuses((s) => ({
              ...s,
              [currentKey]: computed.reduce(
                (a, r) => ({ ...a, [r.tanggal]: "saved" }),
                {} as Record<string, string>
              ),
            }));
            setPendingSaves((p) => ({ ...p, [currentKey]: false }));
            addToast({
              type: "success",
              title: "Auto-saved",
              description: "Stok diterima dihitung dan disimpan",
            });
          } catch (err) {
            console.error(err);
            setPendingSaves((p) => ({ ...p, [currentKey]: true }));
            addToast({
              type: "error",
              title: "Auto-save gagal",
              description: (err as any)?.message ?? String(err),
            });
          } finally {
            computeSaveTimeoutRef.current = null;
            res(null);
          }
        }, 600) as any;
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Hitungan gagal",
        description: (err as any)?.message ?? String(err),
      });
    }
  };

  const handleInput = (
    idx: number,
    field: "keluar" | "akhir",
    value: string
  ) => {
    const v = Number(value);
    const rows =
      areaRows[currentKey] ?? getInitialRows(selectedYear, selectedMonth);
    const copy = [...rows];
    copy[idx] = { ...copy[idx], [field]: v };
    setAreaRows((p) => ({ ...p, [currentKey]: copy }));
    const tanggal = copy[idx].tanggal;
    setRowStatuses((s) => ({
      ...s,
      [currentKey]: { ...(s[currentKey] ?? {}), [tanggal]: "saving" },
    }));
    scheduleRowSave(tanggal, copy[idx]);
  };

  const saveToServer = async () => {
    if (!selectedAreaId)
      return addToast({ type: "error", title: "Pilih area" });
    const rows =
      areaRows[currentKey] ?? getInitialRows(selectedYear, selectedMonth);
    const payload = rows.map((r, i) => {
      // for first day, try previous period local rows or openingAkhirPrev
      let prevAkhir = 0;
      if (i === 0) {
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        const prevKey = areaPeriodKey(selectedAreaId, prevYear, prevMonth);
        const prevRows = areaRows[prevKey];
        if (prevRows && prevRows.length)
          prevAkhir = Number(prevRows[prevRows.length - 1].akhir ?? 0);
        else prevAkhir = Number(openingAkhirPrev ?? 0);
      } else {
        prevAkhir = Number(rows[i - 1]?.akhir ?? 0);
      }
      const akhir = Number(r.akhir ?? 0);
      const keluar = Number(r.keluar ?? 0);
      const diterima =
        r.akhir == null || r.keluar == null || Number(r.akhir) === 0
          ? 0
          : akhir - (prevAkhir - keluar);
      return {
        plant_id: selectedAreaId,
        tanggal: r.tanggal,
        stok_diterima: Number(diterima ?? 0),
        stok_keluar: Number(keluar ?? 0),
        stok_akhir: Number(akhir ?? 0),
        dead_stock: Number(activeDeadStock ?? 0),
        life_stock:
          Number((r as any).akhir ?? 0) - Number(activeDeadStock ?? 0),
        notes: r.ket ?? "",
      };
    });
    const firstDay = `${selectedYear}-${pad(selectedMonth + 1)}-01`;
    const lastDay = `${selectedYear}-${pad(selectedMonth + 1)}-${pad(
      getDaysInMonth(selectedYear, selectedMonth)
    )}`;
    try {
      setIsSaving(true);
      const { error: delErr } = await supabase
        .from("packing_plant_stock")
        .delete()
        .eq("plant_id", selectedAreaId)
        .gte("tanggal", firstDay)
        .lte("tanggal", lastDay);
      if (delErr) throw delErr;
      if (payload.length) {
        const { error: insErr } = await supabase
          .from("packing_plant_stock")
          .insert(payload);
        if (insErr) throw insErr;
      }
      setPendingSaves((p) => ({ ...p, [currentKey]: false }));
      addToast({
        type: "success",
        title: "Simpan periode",
        description: "Periode berhasil disimpan ke server",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Simpan gagal",
        description: (err as any)?.message ?? String(err),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportToExcel = async () => {
    if (!selectedAreaId)
      return addToast({ type: "error", title: "Pilih area" });
    try {
      const firstDay = `${selectedYear}-${pad(selectedMonth + 1)}-01`;
      const lastDay = `${selectedYear}-${pad(selectedMonth + 1)}-${pad(
        getDaysInMonth(selectedYear, selectedMonth)
      )}`;
      const { data: dbRows, error } = await supabase
        .from("packing_plant_stock_view")
        .select(
          "tanggal, stokDiterima, stokKeluar, stokAkhir, deadStock, lifeStock, notes"
        )
        .eq("plant_id", selectedAreaId)
        .gte("tanggal", firstDay)
        .lte("tanggal", lastDay)
        .order("tanggal", { ascending: true });
      if (error) throw error;
      const xlsx = (await import("xlsx")) as any;
      const data = (dbRows ?? []).map((r: any) => ({
        tanggal: String(r.tanggal),
        "STOK DITERIMA (TON)": Number(r.stokDiterima ?? 0),
        "STOK KELUAR (TON)": Number(r.stokKeluar ?? 0),
        "STOK AKHIR (TON)": Number(r.stokAkhir ?? 0),
        "DEAD STOCK (TON)": Number(r.deadStock ?? 0),
        "LIFE STOCK (TON)": Number(r.lifeStock ?? 0),
        KETERANGAN: r.notes ?? "",
      }));

      const wb = xlsx.utils.book_new();
      // create worksheet starting from A4 so we can add meta rows above
      const ws = xlsx.utils.json_to_sheet(data, { origin: "A4" });
      // add meta rows
      const areaName =
        packingAreas.find((p) => p.id === selectedAreaId)?.nama ??
        String(selectedAreaId);
      xlsx.utils.sheet_add_aoa(ws, [[`Area: ${areaName}`]], { origin: "A1" });
      xlsx.utils.sheet_add_aoa(ws, [[`Periode: ${firstDay} to ${lastDay}`]], {
        origin: "A2",
      });
      // set reasonable column widths
      ws["!cols"] = [
        { wch: 15 }, // tanggal
        { wch: 18 }, // diterima
        { wch: 18 }, // keluar
        { wch: 18 }, // akhir
        { wch: 15 }, // dead
        { wch: 15 }, // life
        { wch: 30 }, // ket
      ];

      xlsx.utils.book_append_sheet(
        wb,
        ws,
        `${areaName}`.slice(0, 31) || "Sheet1"
      );
      const filename = `stok-area-${selectedAreaId}-${selectedYear}-${
        selectedMonth + 1
      }.xlsx`;
      xlsx.writeFile(wb, filename);
      addToast({
        type: "success",
        title: "Export berhasil",
        description: filename,
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Export gagal",
        description: (err as any)?.message ?? String(err),
      });
    }
  };

  // export whole year across all areas: one sheet per area, include period meta
  const exportYearToExcel = async () => {
    if (!packingAreas || packingAreas.length === 0)
      return addToast({ type: "error", title: "Tidak ada area" });
    try {
      const year = selectedYear;
      const firstDay = `${year}-01-01`;
      const lastDay = `${year}-12-31`;
      const xlsx = (await import("xlsx")) as any;
      const wb = xlsx.utils.book_new();

      for (const a of packingAreas) {
        const { data: dbRows, error } = await supabase
          .from("packing_plant_stock_view")
          .select(
            "tanggal, stokDiterima, stokKeluar, stokAkhir, deadStock, lifeStock, notes"
          )
          .eq("plant_id", a.id)
          .gte("tanggal", firstDay)
          .lte("tanggal", lastDay)
          .order("tanggal", { ascending: true });
        if (error) throw error;
        const data = (dbRows ?? []).map((r: any) => ({
          tanggal: String(r.tanggal),
          "STOK DITERIMA (TON)": Number(r.stokDiterima ?? 0),
          "STOK KELUAR (TON)": Number(r.stokKeluar ?? 0),
          "STOK AKHIR (TON)": Number(r.stokAkhir ?? 0),
          "DEAD STOCK (TON)": Number(r.deadStock ?? 0),
          "LIFE STOCK (TON)": Number(r.lifeStock ?? 0),
          KETERANGAN: r.notes ?? "",
        }));

        const ws = xlsx.utils.json_to_sheet(data, { origin: "A4" });
        xlsx.utils.sheet_add_aoa(ws, [[`Area: ${a.nama}`]], { origin: "A1" });
        xlsx.utils.sheet_add_aoa(ws, [[`Periode: ${firstDay} to ${lastDay}`]], {
          origin: "A2",
        });
        ws["!cols"] = [
          { wch: 15 },
          { wch: 18 },
          { wch: 18 },
          { wch: 18 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 },
        ];
        const safeName = String(a.nama).slice(0, 31);
        xlsx.utils.book_append_sheet(wb, ws, safeName || `area-${a.id}`);
      }

      const filename = `stok-tahun-${selectedYear}.xlsx`;
      xlsx.writeFile(wb, filename);
      addToast({
        type: "success",
        title: "Export berhasil",
        description: filename,
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Export gagal",
        description: (err as any)?.message ?? String(err),
      });
    }
  };

  const onImportYearFile = async (file?: File) => {
    const f = file ?? fileInputYearRef.current?.files?.[0];
    if (!f) return;
    try {
      const ab = await f.arrayBuffer();
      const xlsx = (await import("xlsx")) as any;
      const wb = xlsx.read(ab, { type: "array" });
      const year = selectedYear;
      const updated: Record<string, Row[]> = {};

      for (const sheetName of wb.SheetNames) {
        if (sheetName === "meta") continue;
        const ws = wb.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(ws, { defval: null }) as any[];
        const area = packingAreas.find(
          (p) => String(p.nama) === String(sheetName)
        );
        if (!area) {
          addToast({
            type: "warning",
            title: "Sheet dilewati",
            description: `Sheet ${sheetName} tidak cocok dengan area`,
          });
          continue;
        }
        const dataRows = rows.filter((r) => Object.keys(r).length > 0);
        const normalized = dataRows.map((r) => {
          const parsed = parseExcelRow(r);
          // normalize tanggal to ISO yyyy-mm-dd when possible
          const maybe = parsed.tanggal || "";
          const dt = new Date(String(maybe));
          const tanggal = isNaN(dt.getTime())
            ? String(maybe)
            : `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
                dt.getDate()
              )}`;
          return { ...parsed, tanggal } as Row;
        });
        for (const row of normalized) {
          const d = new Date(row.tanggal);
          if (isNaN(d.getTime())) continue;
          if (d.getFullYear() !== year) continue;
          const m = d.getMonth();
          const key = areaPeriodKey(area.id, year, m);
          updated[key] = updated[key] ?? [];
          updated[key].push(row as Row);
        }
      }

      setAreaRows((prev) => {
        const copy = { ...prev };
        for (const key of Object.keys(updated)) {
          const rows = updated[key].sort((a, b) =>
            String(a.tanggal).localeCompare(String(b.tanggal))
          );
          copy[key] = rows;
        }
        return copy;
      });
      setPendingSaves((p) => {
        const copy = { ...p };
        for (const key of Object.keys(updated)) copy[key] = true;
        return copy;
      });
      addToast({
        type: "success",
        title: "Import lokal tahun",
        description: `Data tahun ${year} diimpor secara lokal.`,
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Import gagal",
        description: (err as any)?.message ?? String(err),
      });
    }
  };

  const onImportFile = async (file?: File) => {
    const f = file ?? fileInputRef.current?.files?.[0];
    if (!f) return;
    try {
      const ab = await f.arrayBuffer();
      const xlsx = (await import("xlsx")) as any;
      const wb = xlsx.read(ab, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(ws, { defval: null }) as any[];
      if (!selectedAreaId)
        return addToast({ type: "error", title: "Pilih area" });
      const mapped: Row[] = data.map((d) => {
        const parsed = parseExcelRow(d as Record<string, any>);
        // normalize tanggal
        const dt = new Date(String(parsed.tanggal || ""));
        const tanggal = isNaN(dt.getTime())
          ? String(parsed.tanggal || "")
          : `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
              dt.getDate()
            )}`;
        return {
          tanggal,
          keluar: Number(parsed.keluar ?? 0),
          akhir: Number(parsed.akhir ?? 0),
          diterima: Number(parsed.diterima ?? 0),
        } as Row;
      });
      setAreaRows((p) => ({ ...p, [currentKey]: mapped }));
      setPendingSaves((p) => ({ ...p, [currentKey]: true }));
      addToast({
        type: "success",
        title: "Import lokal",
        description:
          "Data diimpor secara lokal. Klik Save to server untuk menimpa server.",
      });
      if (autoSaveOnImport) await saveToServer();
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Import gagal",
        description: (err as any)?.message ?? String(err),
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("packing_plant_master_view")
          .select("id, nama, kode, deadStock")
          .order("nama", { ascending: true });
        if (error) throw error;
        if (mounted && Array.isArray(data)) {
          // ensure A->Z ordering client-side as a fallback
          const sorted = [...data].sort((a: any, b: any) =>
            String(a.nama ?? "").localeCompare(String(b.nama ?? ""))
          );
          setPackingAreas(sorted as any[]);
          if (sorted.length) {
            setSelectedAreaId((sorted[0] as any).id);
            ensurePeriodInitialized(
              (sorted[0] as any).id,
              selectedYear,
              selectedMonth
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!selectedAreaId) return;
    (async () => {
      try {
        const firstDay = `${selectedYear}-${pad(selectedMonth + 1)}-01`;
        const lastDay = `${selectedYear}-${pad(selectedMonth + 1)}-${pad(
          getDaysInMonth(selectedYear, selectedMonth)
        )}`;
        const { data: dbRows, error } = await supabase
          .from("packing_plant_stock_view")
          .select(
            "tanggal, stokDiterima, stokKeluar, stokAkhir, deadStock, lifeStock"
          )
          .eq("plant_id", selectedAreaId)
          .gte("tanggal", firstDay)
          .lte("tanggal", lastDay)
          .order("tanggal", { ascending: true });
        if (error) throw error;
        if (mounted && Array.isArray(dbRows) && dbRows.length) {
          const mapped = dbRows.map((r: any) => {
            const akhir = Number(r.stokAkhir ?? 0);
            const dead = Number(r.deadStock ?? activeDeadStock ?? 0);
            const life = Number(r.lifeStock ?? Math.max(0, akhir - dead));
            return {
              tanggal: String(r.tanggal),
              keluar: Number(r.stokKeluar ?? 0),
              akhir,
              diterima: Number(r.stokDiterima ?? 0),
              dead,
              life,
            } as Row;
          });
          setAreaRows((p) => ({ ...p, [currentKey]: mapped }));
          setPendingSaves((p) => ({ ...p, [currentKey]: false }));
          setRowStatuses((s) => ({
            ...s,
            [currentKey]: mapped.reduce(
              (a, r) => ({ ...a, [r.tanggal]: "saved" }),
              {} as Record<string, string>
            ),
          }));
        } else {
          ensurePeriodInitialized(selectedAreaId, selectedYear, selectedMonth);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedAreaId, selectedYear, selectedMonth]);

  useEffect(
    () => () =>
      Object.values(saveTimeoutsRef.current).forEach((t) => clearTimeout(t)),
    []
  );

  // compute & auto-save whenever currentRows or openingAkhirPrev change
  useEffect(() => {
    // run asynchronously but don't block render
    computeAndAutoSaveCurrentPeriod();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, JSON.stringify(currentRows), openingAkhirPrev]);

  const ensurePeriodInitialized = (aId: number, y: number, m: number) =>
    setAreaRows((p) => ({
      ...p,
      [areaPeriodKey(aId, y, m)]:
        p[areaPeriodKey(aId, y, m)] ?? getInitialRows(y, m),
    }));

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => now.getFullYear() - 2 + i
  );
  const nf = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 });

  const computedRows: Row[] = computeDiterimaForRows(currentRows);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">
                Area Packing Plant
              </label>
              <select
                aria-label="Pilih area"
                value={selectedAreaId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedAreaId(id);
                  ensurePeriodInitialized(id, selectedYear, selectedMonth);
                }}
                className="border rounded px-3 py-1 text-sm bg-white"
              >
                {packingAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Bulan</label>
              <select
                aria-label="Pilih bulan"
                value={selectedMonth}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setSelectedMonth(m);
                  if (selectedAreaId !== null)
                    ensurePeriodInitialized(selectedAreaId, selectedYear, m);
                }}
                className="border rounded px-3 py-1 text-sm bg-white"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Tahun</label>
              <select
                aria-label="Pilih tahun"
                value={selectedYear}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setSelectedYear(y);
                  if (selectedAreaId !== null)
                    ensurePeriodInitialized(selectedAreaId, y, selectedMonth);
                }}
                className="border rounded px-3 py-1 text-sm bg-white"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded shadow-sm hover:bg-blue-700 text-sm"
            >
              📤 Export
            </button>

            <button
              onClick={() => exportYearToExcel && exportYearToExcel()}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded shadow-sm hover:bg-blue-700 text-sm"
            >
              📤 Export Tahun
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded shadow-sm hover:bg-green-700 text-sm"
            >
              📥 Import
            </button>

            <button
              onClick={() => fileInputYearRef.current?.click()}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded shadow-sm hover:bg-green-700 text-sm"
            >
              📥 Import Tahun
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => onImportFile(e.target.files?.[0])}
              className="hidden"
            />
            <input
              ref={fileInputYearRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onImportYearFile(e.target.files?.[0])}
              className="hidden"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoSaveOnImport}
                onChange={(e) => setAutoSaveOnImport(e.target.checked)}
              />
              <span>Auto-save imports</span>
            </label>

            <button
              onClick={() => setShowConfirmSave(true)}
              disabled={!pendingSaves[currentKey]}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded shadow-sm hover:bg-red-700 disabled:opacity-40 text-sm"
            >
              💾 Save to server
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Import default lokal. Gunakan "Save to server" untuk menimpa data
          server pada filter saat ini.
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  TANGGAL
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                  STOK DITERIMA (TON)
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                  STOK KELUAR (TON)
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                  STOK AKHIR (TON)
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  STATUS
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                  DEAD STOCK (TON)
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                  LIFE STOCK (TON)
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  KETERANGAN
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {computedRows.map((row, idx) => (
                <tr
                  key={row.tanggal}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <span>{row.tanggal}</span>
                      {idx === 0 &&
                        (() => {
                          const prevMonth =
                            selectedMonth === 0 ? 11 : selectedMonth - 1;
                          const prevYear =
                            selectedMonth === 0
                              ? selectedYear - 1
                              : selectedYear;
                          const prevKey = areaPeriodKey(
                            selectedAreaId,
                            prevYear,
                            prevMonth
                          );
                          const prevRows = areaRows[prevKey];
                          const openingVal =
                            prevRows && prevRows.length
                              ? Number(prevRows[prevRows.length - 1].akhir ?? 0)
                              : openingAkhirPrev ?? null;
                          if (openingVal === null) return null;
                          return (
                            <span
                              className="text-xs text-gray-500"
                              title={`Opening periode sebelumnya: ${nf.format(
                                Number(openingVal)
                              )}`}
                            >
                              ⓘ
                            </span>
                          );
                        })()}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="w-28 text-right px-2 py-1 text-sm">
                      {(() => {
                        const keluarVal =
                          currentRows[idx]?.keluar ?? row.keluar ?? null;
                        const akhirVal =
                          currentRows[idx]?.akhir ?? row.akhir ?? null;
                        const diterimaVal = Number(
                          currentRows[idx]?.diterima ?? row.diterima ?? 0
                        );
                        const display =
                          keluarVal == null ||
                          akhirVal == null ||
                          Number(akhirVal) === 0
                            ? 0
                            : diterimaVal;
                        return nf.format(display);
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      step="0.001"
                      className="w-28 text-right border rounded px-2 py-1 text-sm"
                      value={currentRows[idx]?.keluar ?? 0}
                      onChange={(e) =>
                        handleInput(idx, "keluar", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      step="0.001"
                      className="w-28 text-right border rounded px-2 py-1 text-sm"
                      value={currentRows[idx]?.akhir ?? 0}
                      onChange={(e) =>
                        handleInput(idx, "akhir", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    {(() => {
                      const status =
                        rowStatuses[currentKey]?.[row.tanggal] ?? "saved";
                      if (status === "saving")
                        return (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                            Menyimpan...
                          </span>
                        );
                      if (status === "saved")
                        return (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                            Tersimpan
                          </span>
                        );
                      if (status === "error")
                        return (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
                            Gagal
                          </span>
                        );
                      return <span className="text-xs text-gray-500">-</span>;
                    })()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {typeof row.dead === "number" ? nf.format(row.dead) : "-"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {typeof row.life === "number" ? nf.format(row.life) : "-"}
                  </td>
                  <td className="px-4 py-2">{row.ket ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <div>Legenda:</div>
            <div className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-300 rounded-full" /> Menyimpan
            </div>
            <div className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-green-300 rounded-full" /> Tersimpan
            </div>
            <div className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-red-300 rounded-full" /> Gagal
            </div>
            <div className="ml-auto">
              {pendingSaves[currentKey] ? (
                <span className="text-sm text-red-600">
                  Perubahan lokal belum disimpan
                </span>
              ) : (
                <span className="text-sm text-green-600">Semua tersimpan</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-md p-6 shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi Simpan</h3>
            <p className="text-sm text-gray-700 mb-4">
              Anda akan menimpa data server untuk area dan periode yang dipilih.
              Lanjutkan?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-200"
                onClick={() => setShowConfirmSave(false)}
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded bg-red-600 text-white"
                onClick={async () => {
                  try {
                    setIsSaving(true);
                    await saveToServer();
                  } finally {
                    setIsSaving(false);
                    setShowConfirmSave(false);
                  }
                }}
              >
                {isSaving ? "Menyimpan..." : "Konfirmasi & Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
