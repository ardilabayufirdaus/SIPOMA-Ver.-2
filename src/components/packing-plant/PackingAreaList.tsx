"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import ChartPanel from "./ChartPanel";
import Sparkline from "./Sparkline";
import PrognosaMonthTable from "./PrognosaMonthTable";
import { packingAreasDummy } from "@/constants/master-data-dummy";

const formatNumber = (n: number) => n.toLocaleString("id-ID");
const formatDate = (d?: string | null) => {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return d;
  }
};

// Compute stock-related metrics from the time series.
// Assumptions made:
// - average daily out is the average of positive decreases between consecutive days
//   (use last up to 7 days if available).
// - safety stock = max(3 * avgOut, 5% of current stock) to be slightly above dead stock.
// - dead stock = minimum positive stock observed in the window, fallback to 1.
// - predicted critical date = the date when projected stock <= safetyStock using avgOut.
const computeStockMetrics = (
  series: { date: string; value: number }[],
  last: number,
  windowLen = 14,
  deadStockOverride?: number
) => {
  if (!series || series.length < 2 || last == null) {
    return {
      avgOut: 0,
      daysRemaining: null as number | null,
      safetyStock: null as number | null,
      deadStock: null as number | null,
      predictedCriticalDate: null as string | null,
    };
  }

  // compute daily outs (prev - curr) for positive drops
  const outs: number[] = [];
  for (let i = Math.max(1, series.length - windowLen); i < series.length; i++) {
    const prev = series[i - 1]?.value ?? 0;
    const cur = series[i]?.value ?? 0;
    const out = Math.max(prev - cur, 0);
    if (out > 0) outs.push(out);
  }

  const avgOut = outs.length
    ? outs.reduce((s, v) => s + v, 0) / outs.length
    : 0;

  // allow master data override for dead stock
  const deadStockCandidate = series.map((s) => s.value).filter((v) => v > 0);
  const computedDead = deadStockCandidate.length
    ? Math.min(...deadStockCandidate)
    : 1;
  const deadStock =
    typeof deadStockOverride === "number" ? deadStockOverride : computedDead;

  // safetyStock: per request, set to 20% above dead stock
  const safetyStock = Math.ceil(deadStock * 1.2);

  let daysRemaining: number | null = null;
  if (avgOut > 0) daysRemaining = Math.floor(last / avgOut);

  let predictedCriticalDate: string | null = null;
  if (avgOut > 0) {
    const daysToCritical = (last - safetyStock) / avgOut;
    if (daysToCritical <= 0) {
      // already at/below safety
      predictedCriticalDate = series.length
        ? series[series.length - 1].date
        : null;
    } else {
      const lastDateStr = series[series.length - 1].date;
      const base = new Date(lastDateStr);
      base.setDate(base.getDate() + Math.ceil(daysToCritical));
      predictedCriticalDate = base.toISOString().slice(0, 10);
    }
  }

  return {
    avgOut,
    daysRemaining,
    safetyStock,
    deadStock,
    predictedCriticalDate,
  };
};

type AreaItem = { id: number; nama: string; kode?: string };

export default function PackingAreaList() {
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [mode, setMode] = useState<"chart" | "table">("chart");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [threshold, setThreshold] = useState<number>(20);
  const [avgWindow, setAvgWindow] = useState<number>(14);
  const [areaStocks, setAreaStocks] = useState<
    Record<
      number,
      {
        last: number;
        lastDate: string | null;
        series: { date: string; value: number }[];
      }
    >
  >({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("packing_plant_master_view")
          .select("id, nama, kode")
          .order("nama", { ascending: true });
        if (error) throw error;
        if (!mounted) return;
        const arr = Array.isArray(data) ? (data as unknown[]) : [];
        const mapped: AreaItem[] = arr.map((it) => {
          const obj = it as Record<string, unknown>;
          return {
            id: Number(obj.id as number | string),
            nama: String(obj.nama),
            kode: obj.kode as string,
          };
        });
        setAreas(mapped);
        if (mapped.length) setSelectedArea(mapped[0].id ?? null);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const listRef = useRef<HTMLDivElement | null>(null);

  // Load saved threshold from localStorage on mount and persist changes.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("packingPlant.threshold");
      if (raw != null) {
        const v = Number(raw);
        if (!Number.isNaN(v)) setThreshold(v);
      }
    } catch (e) {
      // ignore (e.g., storage disabled)
    }
  }, []);

  // load avgWindow preference
  useEffect(() => {
    try {
      const raw = localStorage.getItem("packingPlant.avgWindow");
      if (raw != null) {
        const v = Number(raw);
        if (!Number.isNaN(v)) setAvgWindow(v);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("packingPlant.threshold", String(threshold));
    } catch (e) {
      // ignore write errors
    }
  }, [threshold]);

  useEffect(() => {
    try {
      localStorage.setItem("packingPlant.avgWindow", String(avgWindow));
    } catch (e) {
      // ignore
    }
  }, [avgWindow]);

  const filteredAreas = useMemo(() => {
    if (!search) return areas;
    const q = search.toLowerCase();
    return areas.filter((a) =>
      `${a.nama} ${a.kode ?? ""}`.toLowerCase().includes(q)
    );
  }, [areas, search]);

  const fetchAreaSeries = async (areaId: number) => {
    try {
      setLoading(true);
      const from = new Date();
      from.setDate(from.getDate() - 29);
      const start = from.toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("packing_plant_stock_view")
        .select("tanggal, stokAkhir, stokKeluar")
        .eq("plant_id", areaId)
        .gte("tanggal", start)
        .order("tanggal", { ascending: true });
      if (error) throw error;
      const arr = Array.isArray(data) ? (data as unknown[]) : [];
      const series = arr.map((r) => {
        const rec = r as Record<string, unknown>;
        return {
          date: String(rec.tanggal as string).slice(0, 10),
          value: Number((rec.stokAkhir as number) ?? 0),
          out: Number((rec.stokKeluar as number) ?? 0),
        } as { date: string; value: number; out?: number };
      });
      // Use the most recent stock value > 0 as the "last" value and record its date.
      // This skips trailing zeros so the displayed "stok terakhir" reflects
      // the last non-zero ending stock in the fetched window.
      let last = 0;
      let lastDate: string | null = null;
      for (let i = series.length - 1; i >= 0; i--) {
        const v = series[i].value ?? 0;
        if (v > 0) {
          last = v;
          lastDate = series[i].date ?? null;
          break;
        }
      }
      setAreaStocks((s) => ({ ...s, [areaId]: { last, lastDate, series } }));
    } catch (e) {
      console.error(e);
      setAreaStocks((s) => ({
        ...s,
        [areaId]: { last: 0, lastDate: null, series: [] },
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedArea !== null) fetchAreaSeries(selectedArea);
  }, [selectedArea]);

  const current = useMemo(
    () => (selectedArea ? areaStocks[selectedArea] ?? null : null),
    [selectedArea, areaStocks]
  );

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Area Packing Plant</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("chart")}
            className={`px-3 py-1.5 ${
              mode === "chart" ? "bg-red-50 text-red-600" : "text-gray-600"
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setMode("table")}
            className={`px-3 py-1.5 ${
              mode === "table" ? "bg-red-50 text-red-600" : "text-gray-600"
            }`}
          >
            Table
          </button>
          <div className="flex items-center gap-2 ml-2">
            <label className="text-xs text-gray-600">Threshold %</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value || 0))}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 p-4 bg-white border rounded">
          <div className="mb-3 flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari area atau kode..."
              className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-300"
            />
            <div className="text-xs text-gray-500">{filteredAreas.length}</div>
          </div>
          <div
            ref={listRef}
            className="space-y-2 max-h-[540px] overflow-y-auto pr-2"
          >
            {areas.length === 0 && (
              <div className="text-sm text-gray-500">Memuat area...</div>
            )}
            {filteredAreas.map((a) => (
              <div
                key={a.id}
                title={`${a.nama} • ${a.kode ?? "-"}`}
                className={`p-2 rounded cursor-pointer flex justify-between items-center transition-shadow duration-150 ${
                  selectedArea === a.id
                    ? "bg-red-50 ring-2 ring-red-200 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedArea(a.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-[120px]">
                    <div className="text-sm font-medium">{a.nama}</div>
                    <div className="text-xs text-gray-500">{a.kode ?? "-"}</div>
                  </div>
                  <div className="hidden sm:block">
                    <Sparkline series={areaStocks[a.id]?.series ?? []} />
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div className="font-semibold">
                    {areaStocks[a.id]?.last != null
                      ? formatNumber(areaStocks[a.id].last)
                      : loading
                      ? "..."
                      : "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(areaStocks[a.id]?.lastDate ?? null)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-8 p-4 bg-white border rounded">
          {!selectedArea && (
            <div className="text-sm text-gray-500">
              Pilih area untuk melihat detail
            </div>
          )}
          {selectedArea && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-md font-semibold">
                    Prognosa Stok —{" "}
                    {areas.find((x) => x.id === selectedArea)?.nama}
                  </div>
                  <div className="text-xs text-gray-500">
                    Area code:{" "}
                    {areas.find((x) => x.id === selectedArea)?.kode ?? "-"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs">Stok terakhir</div>
                  <div className="text-lg font-semibold">
                    {current?.last != null
                      ? formatNumber(current.last)
                      : loading
                      ? "..."
                      : "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Terakhir update: {formatDate(current?.lastDate ?? null)}
                  </div>
                </div>
              </div>

              {/* Stock metrics row with small sparklines, tooltips and avgWindow control */}
              {(() => {
                const master = packingAreasDummy.find(
                  (p) => p.id === selectedArea
                );
                const mets = computeStockMetrics(
                  current?.series ?? [],
                  current?.last ?? 0,
                  avgWindow,
                  master?.deadStock
                );
                // show simplified metrics (no mini-sparklines or trend icons)

                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600">
                        Ringkasan metrik
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-gray-500">
                          Avg window
                        </label>
                        <select
                          value={avgWindow}
                          onChange={(e) => setAvgWindow(Number(e.target.value))}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value={7}>7 hari</option>
                          <option value={14}>14 hari</option>
                          <option value={30}>30 hari</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4 text-sm">
                      <div
                        className="p-3 bg-gray-50 rounded"
                        title={`Ketahanan: estimasi hari bertahan berdasarkan rata-rata pengeluaran ${avgWindow} hari terakhir`}
                      >
                        <div>
                          <div className="text-xs text-gray-500">Ketahanan</div>
                          <div className="font-semibold">
                            {mets.daysRemaining == null
                              ? "-"
                              : mets.avgOut <= 0
                              ? "Naik / Stabil"
                              : `${mets.daysRemaining} hari`}
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-3 bg-gray-50 rounded"
                        title={`Safety stock: buffer minimal (heuristik)`}
                      >
                        <div>
                          <div className="text-xs text-gray-500">
                            Safety stok
                          </div>
                          <div className="font-semibold">
                            {mets.safetyStock == null
                              ? "-"
                              : formatNumber(mets.safetyStock)}
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-3 bg-gray-50 rounded"
                        title={`Dead stock: stok minimal yang masih tercatat dalam window`}
                      >
                        <div>
                          <div className="text-xs text-gray-500">Dead stok</div>
                          <div className="font-semibold">
                            {mets.deadStock == null
                              ? "-"
                              : formatNumber(mets.deadStock)}
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-3 bg-gray-50 rounded"
                        title={`Prediksi tanggal stok kritis (saat stok turun ke bawah safety stock)`}
                      >
                        <div>
                          <div className="text-xs text-gray-500">
                            Prediksi stok kritis
                          </div>
                          <div className="font-semibold">
                            {mets.predictedCriticalDate == null
                              ? mets.avgOut <= 0
                                ? "Tidak kritis"
                                : "-"
                              : formatDate(mets.predictedCriticalDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {mode === "chart" ? (
                <ChartPanel
                  series={current?.series ?? []}
                  loading={loading}
                  threshold={threshold}
                  avgWindow={avgWindow}
                />
              ) : (
                <PrognosaMonthTable
                  series={current?.series ?? []}
                  loading={loading}
                  threshold={threshold}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// components moved to separate files: ChartPanel, PrognosaMonthTable, Sparkline
