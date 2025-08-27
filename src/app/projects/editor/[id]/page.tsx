"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type ActivityRow = {
  id: string;
  aktivitas: string;
  status: "Planned" | "On Progress" | "Done" | "Blocked";
  bobot: number;
  rencanaMulai: string; // yyyy-mm-dd
  rencanaSelesai: string;
  aktualMulai?: string | null;
  aktualSelesai?: string | null;
  persenSelesai: number;
};

const makeDummy = (): ActivityRow[] => [
  {
    id: "a1",
    aktivitas: "Mobilisasi Tim",
    status: "Done",
    bobot: 5,
    rencanaMulai: "2025-01-02",
    rencanaSelesai: "2025-01-05",
    aktualMulai: "2025-01-02",
    aktualSelesai: "2025-01-04",
    persenSelesai: 100,
  },
  {
    id: "a2",
    aktivitas: "Survey Lokasi",
    status: "Done",
    bobot: 10,
    rencanaMulai: "2025-01-06",
    rencanaSelesai: "2025-01-10",
    aktualMulai: "2025-01-06",
    aktualSelesai: "2025-01-09",
    persenSelesai: 100,
  },
  {
    id: "a3",
    aktivitas: "Pengadaan Material",
    status: "On Progress",
    bobot: 30,
    rencanaMulai: "2025-02-01",
    rencanaSelesai: "2025-04-30",
    aktualMulai: "2025-02-05",
    aktualSelesai: null,
    persenSelesai: 40,
  },
  {
    id: "a4",
    aktivitas: "Instalasi Peralatan",
    status: "Planned",
    bobot: 40,
    rencanaMulai: "2025-05-01",
    rencanaSelesai: "2025-08-31",
    aktualMulai: null,
    aktualSelesai: null,
    persenSelesai: 0,
  },
  {
    id: "a5",
    aktivitas: "Commissioning",
    status: "Planned",
    bobot: 15,
    rencanaMulai: "2025-09-01",
    rencanaSelesai: "2025-11-30",
    aktualMulai: null,
    aktualSelesai: null,
    persenSelesai: 0,
  },
];

function daysBetween(start?: string | null, end?: string | null) {
  if (!start || !end) return "-";
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return String(diff);
}

export default function Page() {
  const [rows, setRows] = useState<ActivityRow[]>(makeDummy());
  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [sortBy, setSortBy] = useState<"order" | "bobotDesc" | "aktivitas">(
    "order"
  );

  const totalBobot = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.bobot) || 0), 0),
    [rows]
  );

  // validation: total bobot must equal 100
  const isTotalValid = totalBobot === 100;

  const updateCell = (
    id: string,
    key: keyof ActivityRow,
    value: ActivityRow[keyof ActivityRow]
  ) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, [key]: value } : r));
      return next;
    });
    setUnsaved(true);
  };

  // Drag-to-reorder handlers
  const onDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropRow = (
    e: React.DragEvent<HTMLTableRowElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id || id === targetId) return;
    setRows((prev) => {
      const fromIndex = prev.findIndex((r) => r.id === id);
      const toIndex = prev.findIndex((r) => r.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setUnsaved(true);
  };

  const onDragOverRow = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSave = async () => {
    if (!isTotalValid) {
      alert("Total bobot harus 100% sebelum menyimpan.");
      return;
    }
    setSaving(true);
    // simulate save
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setUnsaved(false);
    alert("Perubahan disimpan (dummy)");
  };

  // Warn when closing tab/window with unsaved changes
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!unsaved) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes.";
      return "You have unsaved changes.";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [unsaved]);

  // simple sorting control (non-destructive; updates order in state)
  const applySort = (mode: typeof sortBy) => {
    setSortBy(mode);
    setRows((prev) => {
      const next = [...prev];
      if (mode === "bobotDesc") next.sort((a, b) => b.bobot - a.bobot);
      else if (mode === "aktivitas")
        next.sort((a, b) => a.aktivitas.localeCompare(b.aktivitas));
      return next;
    });
    setUnsaved(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Editor Proyek</h1>
          <p className="text-sm text-gray-600">
            Edit aktivitas proyek (dummy data)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (unsaved) {
                if (
                  !confirm(
                    "Ada perubahan belum disimpan. Kembali tanpa menyimpan?"
                  )
                )
                  return;
              }
              window.open("/projects", "_self");
            }}
          >
            Kembali
          </Button>
          <Button onClick={handleSave} disabled={saving || !isTotalValid}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Urut:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              applySort(e.target.value as "order" | "bobotDesc" | "aktivitas")
            }
            className="px-2 py-1 border rounded"
          >
            <option value="order">Manual (drag to reorder)</option>
            <option value="bobotDesc">Bobot (desc)</option>
            <option value="aktivitas">Aktivitas (A-Z)</option>
          </select>
        </div>
        <div className="text-sm">
          Total Bobot: <strong>{totalBobot}%</strong>
          {!isTotalValid && (
            <span className="text-red-600 ml-3">Total harus 100%</span>
          )}
          {unsaved && (
            <span className="text-yellow-600 ml-3">
              Ada perubahan belum disimpan
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-3 py-2 border">No.</th>
              <th className="px-3 py-2 border">Aktivitas</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Bobot (%)</th>
              <th className="px-3 py-2 border">Rencana Mulai</th>
              <th className="px-3 py-2 border">Rencana Selesai</th>
              <th className="px-3 py-2 border">Durasi (Hari)</th>
              <th className="px-3 py-2 border">Aktual Mulai</th>
              <th className="px-3 py-2 border">Aktual Selesai</th>
              <th className="px-3 py-2 border">% Selesai</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-grab"
                draggable
                onDragStart={(e) => onDragStart(e, row.id)}
                onDragOver={onDragOverRow}
                onDrop={(e) => onDropRow(e, row.id)}
              >
                <td className="px-3 py-2 border align-top">{idx + 1}</td>
                <td className="px-3 py-2 border align-top">
                  <input
                    className="w-full px-2 py-1 border rounded"
                    value={row.aktivitas}
                    onChange={(e) =>
                      updateCell(row.id, "aktivitas", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2 border align-top">
                  <select
                    className="px-2 py-1 border rounded"
                    value={row.status}
                    onChange={(e) =>
                      updateCell(
                        row.id,
                        "status",
                        e.target.value as ActivityRow["status"]
                      )
                    }
                  >
                    <option value="Planned">Planned</option>
                    <option value="On Progress">On Progress</option>
                    <option value="Done">Done</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </td>
                <td className="px-3 py-2 border align-top">
                  <input
                    type="number"
                    className="w-24 px-2 py-1 border rounded"
                    value={row.bobot}
                    onChange={(e) =>
                      updateCell(row.id, "bobot", Number(e.target.value || 0))
                    }
                  />
                </td>
                <td className="px-3 py-2 border align-top">
                  <input
                    type="date"
                    className="px-2 py-1 border rounded"
                    value={row.rencanaMulai}
                    onChange={(e) =>
                      updateCell(row.id, "rencanaMulai", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2 border align-top">
                  <input
                    type="date"
                    className="px-2 py-1 border rounded"
                    value={row.rencanaSelesai}
                    onChange={(e) =>
                      updateCell(row.id, "rencanaSelesai", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2 border align-top">
                  {daysBetween(row.rencanaMulai, row.rencanaSelesai)}
                </td>
                <td className="px-3 py-2 border align-top">
                  <input
                    type="date"
                    className="px-2 py-1 border rounded"
                    value={row.aktualMulai || ""}
                    onChange={(e) =>
                      updateCell(row.id, "aktualMulai", e.target.value || null)
                    }
                  />
                </td>
                <td className="px-3 py-2 border align-top">
                  <input
                    type="date"
                    className="px-2 py-1 border rounded"
                    value={row.aktualSelesai || ""}
                    onChange={(e) =>
                      updateCell(
                        row.id,
                        "aktualSelesai",
                        e.target.value || null
                      )
                    }
                  />
                </td>
                <td className="px-3 py-2 border align-top">
                  <input
                    type="number"
                    className="w-20 px-2 py-1 border rounded"
                    value={row.persenSelesai}
                    onChange={(e) =>
                      updateCell(
                        row.id,
                        "persenSelesai",
                        Number(e.target.value || 0)
                      )
                    }
                  />
                </td>
              </tr>
            ))}

            <tr className="bg-gray-50">
              <td className="px-3 py-2 border" colSpan={3}>
                <strong>Total</strong>
              </td>
              <td className="px-3 py-2 border">
                <strong>{totalBobot}%</strong>
              </td>
              <td className="px-3 py-2 border" colSpan={6}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
