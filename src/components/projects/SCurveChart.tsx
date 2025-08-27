"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SCurveData {
  week: number;
  planned: number;
  actual: number;
  cumulativePlanned: number;
  cumulativeActual: number;
}

interface SCurveChartProps {
  data: SCurveData[];
  projectName: string;
  projectCode: string;
}

const SCurveChart: React.FC<SCurveChartProps> = ({
  data,
  projectName,
  projectCode,
}) => {
  const formatTooltip = (value: number, name: string) => {
    if (name === "Cumulative Planned" || name === "Cumulative Actual") {
      return [`${value}%`, name];
    }
    return [`${value}%`, name];
  };

  const getPerformanceStatus = () => {
    if (data.length === 0) return { status: "No Data", color: "gray" };

    const latest = data[data.length - 1];
    const variance = latest.cumulativeActual - latest.cumulativePlanned;

    if (variance > 5) return { status: "Ahead", color: "green" };
    if (variance < -5) return { status: "Behind", color: "red" };
    return { status: "On Track", color: "blue" };
  };

  const performance = getPerformanceStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">S-Curve Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              {projectName} ({projectCode})
            </p>
          </div>
          <Badge
            variant={
              performance.color === "green"
                ? "default"
                : performance.color === "red"
                ? "destructive"
                : "secondary"
            }
            className={performance.color === "blue" ? "bg-blue-500" : ""}
          >
            {performance.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                label={{ value: "Week", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "Progress (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulativePlanned"
                stroke="#8884d8"
                strokeWidth={2}
                name="Cumulative Planned"
                dot={{ fill: "#8884d8" }}
              />
              <Line
                type="monotone"
                dataKey="cumulativeActual"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Cumulative Actual"
                dot={{ fill: "#82ca9d" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {data.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current Week</p>
              <p className="font-medium">{data[data.length - 1].week}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Planned Progress</p>
              <p className="font-medium">
                {data[data.length - 1].cumulativePlanned}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Actual Progress</p>
              <p className="font-medium">
                {data[data.length - 1].cumulativeActual}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Variance</p>
              <p
                className={`font-medium ${
                  data[data.length - 1].cumulativeActual -
                    data[data.length - 1].cumulativePlanned >
                  0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data[data.length - 1].cumulativeActual -
                  data[data.length - 1].cumulativePlanned >
                0
                  ? "+"
                  : ""}
                {data[data.length - 1].cumulativeActual -
                  data[data.length - 1].cumulativePlanned}
                %
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SCurveChart;
