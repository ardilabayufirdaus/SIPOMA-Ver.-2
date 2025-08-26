"use client";

import React from "react";
import { formatNumber } from "./helpers";

export default function Sparkline({
  series,
}: {
  series: { date: string; value: number }[];
}) {
  if (!series || series.length === 0) return null;
  const w = 80;
  const h = 24;
  const vals = series.map((s) => s.value);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = max === min ? h / 2 : h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="inline-block align-middle"
    >
      <polyline
        fill="none"
        stroke="#ef4444"
        strokeWidth={1.5}
        points={points.join(" ")}
      />
    </svg>
  );
}
