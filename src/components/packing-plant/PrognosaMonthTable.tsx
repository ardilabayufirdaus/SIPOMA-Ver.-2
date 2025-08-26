"use client";

import React from "react";
import { formatNumber } from "./helpers";

export default function PrognosaMonthTable({
  series,
  loading,
  threshold = 20,
}: {
  series: { date: string; value: number }[];
  loading: boolean;
  threshold?: number;
}) {
  if (loading) return <div className="p-6 text-gray-500">Memuat tabel...</div>;

  const refDate =
    series && series.length
      ? new Date(series[series.length - 1].date)
      : new Date();
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const stokMap: Record<string, number> = {};
  const outMap: Record<string, number> = {};
  (series || []).forEach((s) => {
    const key = s.date.slice(0, 10);
    stokMap[key] = Number(s.value ?? 0);
    if (typeof (s as any).out === "number")
      outMap[key] = Number((s as any).out ?? 0);
  });

  const rows: {
    tanggal: string;
    prognosa: number;
    actual: number;
    deviasi: number;
    persen: number;
  }[] = [];
  let lastKnown: number | null = null;
  const actuals: number[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const key = dt.toISOString().slice(0, 10);
    const stokToday: number | null = key in stokMap ? stokMap[key] : lastKnown;
    // prefer explicit out value from series (Entri Data Stok) when available
    const explicitOut = key in outMap ? outMap[key] : null;
    let actual = 0;
    if (explicitOut != null) actual = Math.max(0, explicitOut);
    else if (lastKnown != null && stokToday != null)
      actual = Math.max(0, lastKnown - stokToday);
    actuals.push(actual);
    const idx = actuals.length - 1;
    const winStart = Math.max(0, idx - 7);
    const win = actuals.slice(winStart, idx);
    const prognosa = win.length
      ? win.reduce((a, b) => a + b, 0) / win.length
      : 0;
    const deviasi = prognosa - actual;
    const persen =
      actual === 0 ? (deviasi === 0 ? 0 : 100) : (deviasi / actual) * 100;
    rows.push({
      tanggal: key,
      prognosa: Math.round(prognosa),
      actual: Math.round(actual),
      deviasi: Math.round(deviasi),
      persen,
    });
    if (stokToday != null) lastKnown = stokToday;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">
          Threshold warna persen: {threshold}%
        </div>
        <div className="text-xs text-gray-500">
          Merah: &gt;= {threshold}% · Hijau: &lt;= -{threshold}%
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
              Tanggal
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
              Stok Keluar (Prognosa)
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
              Stok Keluar (Aktual)
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
              Deviasi
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
              Persentase (%)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2 text-sm text-gray-700">
                {new Date(r.tanggal).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 text-right">
                {formatNumber(r.prognosa)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 text-right">
                {formatNumber(r.actual)}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                <div
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    r.deviasi > 0
                      ? "bg-green-50 text-green-700"
                      : r.deviasi < 0
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {formatNumber(r.deviasi)}
                </div>
              </td>
              <td className="px-4 py-2 text-sm text-right">
                <div
                  className={`inline-block w-[72px] text-right ${
                    r.persen >= threshold
                      ? "text-red-600"
                      : r.persen <= -threshold
                      ? "text-green-600"
                      : "text-gray-700"
                  }`}
                >
                  {r.persen.toFixed(1)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
