"use client";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProductionData {
  time: string;
  production: number;
  efficiency: number;
  energy: number;
}

export function ProductionChart() {
  const [data, setData] = useState<ProductionData[]>([]);

  // Generate initial data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const newData = [];

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        newData.push({
          time: time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          production: Math.floor(Math.random() * 100) + 200,
          efficiency: Math.floor(Math.random() * 20) + 70,
          energy: Math.floor(Math.random() * 50) + 100,
        });
      }

      setData(newData);
    };

    generateData();

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          production: Math.floor(Math.random() * 100) + 200,
          efficiency: Math.floor(Math.random() * 20) + 70,
          energy: Math.floor(Math.random() * 50) + 100,
        };

        return [...prev.slice(1), newPoint];
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${
                entry.name === "Efficiency"
                  ? "%"
                  : entry.name === "Production"
                  ? " TPH"
                  : " kWh"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full flex flex-col justify-between">
      <div className="flex-1 min-h-0 overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              name="Production"
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Efficiency"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Energy"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm px-2 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">
            Production (TPH)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">
            Efficiency (%)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Energy (kWh)</span>
        </div>
      </div>
    </div>
  );
}
