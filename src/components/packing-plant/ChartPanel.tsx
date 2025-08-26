"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { formatNumber } from "./helpers";

type Props = {
  series: { date: string; value: number; out?: number }[];
  loading: boolean;
  threshold?: number;
  avgWindow?: number;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: unknown[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const arr = payload as Array<Record<string, unknown>>;
  const stok = arr.find((p) => p.dataKey === "stok")?.value as
    | number
    | undefined;
  const out = arr.find((p) => p.dataKey === "out")?.value as number | undefined;
  return (
    <div className="bg-white p-2 rounded shadow text-sm">
      <div className="font-semibold">
        {label ? new Date(label).toLocaleDateString("id-ID") : "-"}
      </div>
      <div className="mt-1 text-xs text-gray-600">
        Stok: {formatNumber(Number(stok ?? 0))}
      </div>
      <div className="text-xs text-gray-600">
        Stok Keluar: {formatNumber(Number(out ?? 0))}
      </div>
    </div>
  );
}

export default function ChartPanel({
  series,
  loading,
  threshold = 20,
  avgWindow = 7,
}: Props) {
  if (loading) return <div className="p-6 text-gray-500">Memuat data...</div>;
  if (!series || series.length === 0)
    return (
      <div className="p-6 text-gray-400">
        Tidak ada data historis untuk area ini.
      </div>
    );

  // build data including actual out (prefer explicit out from series if present)
  const data = series.map((s, i) => {
    const prev = i > 0 ? series[i - 1].value : series[i].value;
    // do not compute out if current or previous stok akhir is 0
    const computedOut =
      Number(s.value) === 0 || Number(prev) === 0
        ? 0
        : Math.max(0, Math.round(prev - s.value));
    const out = typeof s.out === "number" ? Math.round(s.out) : computedOut;
    const fill = out >= threshold ? "#dc2626" : "#f97316";
    return { date: s.date, stok: s.value, out, fill } as any;
  });

  // compute prognosa (moving average) of out using avgWindow
  const outPrognosa: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - (avgWindow - 1));
    const window = data.slice(start, i + 1).map((d) => d.out);
    const avg = window.length
      ? Math.round(window.reduce((a, b) => a + b, 0) / window.length)
      : 0;
    outPrognosa.push(avg);
  }
  // attach prognosa into data points
  for (let i = 0; i < data.length; i++) data[i].outPrognosa = outPrognosa[i];

  const last = data[data.length - 1];
  const vals = data.map((d) => d.stok);
  const avg = vals.length
    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    : 0;
  const mx = vals.length ? Math.max(...vals) : 0;
  const mn = vals.length ? Math.min(...vals) : 0;

  return (
    <div style={{ width: "100%", height: 360 }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          Ringkasan: avg {formatNumber(avg)} · max {formatNumber(mx)} · min{" "}
          {formatNumber(mn)}
        </div>
        <div className="text-xs text-gray-500">
          Highlight bar merah = &gt;= {threshold}% out
        </div>
      </div>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 24, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString("id-ID").slice(0, 5)
            }
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" align="left" height={24} />
          {/* vertical line for today */}
          {(() => {
            const today = new Date().toISOString().slice(0, 10);
            return (
              <ReferenceLine
                x={today}
                stroke="#10B981"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: "Hari ini", position: "top", fill: "#065f46" }}
              />
            );
          })()}
          <Area
            type="monotone"
            dataKey="stok"
            stroke="#ef4444"
            fill="#fee2e2"
            animationDuration={900}
            activeDot={{ r: 6 }}
          />
          <Bar dataKey="out" barSize={18} animationDuration={900}>
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={(entry as { fill: string }).fill}
                style={{ transition: "fill 420ms ease" }}
              />
            ))}
          </Bar>
          {/* prognosa line for stok keluar */}
          <Area
            type="monotone"
            dataKey="outPrognosa"
            stroke="#2563eb"
            fill="rgba(37,99,235,0.04)"
            animationDuration={900}
            dot={false}
            isAnimationActive={false}
          />
          {last && (
            <ReferenceDot
              x={last.date}
              y={last.stok}
              r={5}
              fill="#ef4444"
              stroke="#fff"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-gray-500">
        Gabungan area (stok) dan bar (stok keluar harian).
      </div>
    </div>
  );
}
