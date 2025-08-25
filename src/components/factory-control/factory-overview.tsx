"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Factory,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Thermometer,
  Gauge,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface FactoryStatus {
  unit: string;
  status: "running" | "stopped" | "maintenance" | "alert";
  production: number;
  target: number;
  efficiency: number;
  temperature: number;
  power: number;
  vibration: number;
  lastUpdate: string;
}

interface ProductionData {
  time: string;
  cement: number;
  clinker: number;
  rawMill: number;
}

const mockFactoryStatus: FactoryStatus[] = [
  {
    unit: "Cement Mill #1",
    status: "running",
    production: 85,
    target: 90,
    efficiency: 94.4,
    temperature: 75,
    power: 4200,
    vibration: 2.3,
    lastUpdate: "2 minutes ago",
  },
  {
    unit: "Cement Mill #2",
    status: "running",
    production: 92,
    target: 90,
    efficiency: 102.2,
    temperature: 73,
    power: 4350,
    vibration: 1.8,
    lastUpdate: "1 minute ago",
  },
  {
    unit: "Raw Mill #1",
    status: "maintenance",
    production: 0,
    target: 120,
    efficiency: 0,
    temperature: 45,
    power: 0,
    vibration: 0,
    lastUpdate: "30 minutes ago",
  },
  {
    unit: "Kiln #1",
    status: "running",
    production: 110,
    target: 115,
    efficiency: 95.7,
    temperature: 1450,
    power: 8500,
    vibration: 3.2,
    lastUpdate: "1 minute ago",
  },
  {
    unit: "Rotary Kiln #2",
    status: "alert",
    production: 75,
    target: 115,
    efficiency: 65.2,
    temperature: 1480,
    power: 8200,
    vibration: 4.8,
    lastUpdate: "30 seconds ago",
  },
];

const mockProductionData: ProductionData[] = [
  { time: "00:00", cement: 180, clinker: 220, rawMill: 240 },
  { time: "04:00", cement: 195, clinker: 235, rawMill: 255 },
  { time: "08:00", cement: 210, clinker: 250, rawMill: 270 },
  { time: "12:00", cement: 175, clinker: 215, rawMill: 235 },
  { time: "16:00", cement: 190, clinker: 230, rawMill: 250 },
  { time: "20:00", cement: 185, clinker: 225, rawMill: 245 },
  { time: "24:00", cement: 200, clinker: 240, rawMill: 260 },
];

export default function FactoryOverview() {
  const [factoryData, setFactoryData] =
    useState<FactoryStatus[]>(mockFactoryStatus);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setFactoryData((prev) =>
        prev.map((unit) => ({
          ...unit,
          production:
            unit.status === "running"
              ? Math.max(0, unit.production + (Math.random() - 0.5) * 10)
              : unit.production,
          temperature:
            unit.status === "running"
              ? unit.temperature + (Math.random() - 0.5) * 5
              : unit.temperature,
          power:
            unit.status === "running"
              ? unit.power + (Math.random() - 0.5) * 200
              : unit.power,
          vibration:
            unit.status === "running"
              ? Math.max(0, unit.vibration + (Math.random() - 0.5) * 0.5)
              : unit.vibration,
          lastUpdate: "Just now",
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 border-green-200";
      case "stopped":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4" />;
      case "stopped":
        return <Pause className="h-4 w-4" />;
      case "maintenance":
        return <RotateCcw className="h-4 w-4" />;
      case "alert":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const runningUnits = factoryData.filter(
    (unit) => unit.status === "running"
  ).length;
  const totalProduction = factoryData.reduce(
    (sum, unit) => sum + unit.production,
    0
  );
  const averageEfficiency =
    factoryData.reduce((sum, unit) => sum + unit.efficiency, 0) /
    factoryData.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Factory className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {runningUnits}/{factoryData.length}
              </p>
              <p className="text-sm text-gray-600">Units Running</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {totalProduction.toFixed(0)} t/h
              </p>
              <p className="text-sm text-gray-600">Total Production</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Gauge className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {averageEfficiency.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Avg Efficiency</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {factoryData.filter((unit) => unit.status === "alert").length}
              </p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Production Trend - Last 24 Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockProductionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cement"
                stroke="#dc2626"
                strokeWidth={2}
                name="Cement (t/h)"
              />
              <Line
                type="monotone"
                dataKey="clinker"
                stroke="#16a34a"
                strokeWidth={2}
                name="Clinker (t/h)"
              />
              <Line
                type="monotone"
                dataKey="rawMill"
                stroke="#2563eb"
                strokeWidth={2}
                name="Raw Mill (t/h)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Factory Units Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {factoryData.map((unit, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-200 ${
              selectedUnit === unit.unit
                ? "ring-2 ring-red-600"
                : "hover:shadow-lg"
            }`}
            onClick={() =>
              setSelectedUnit(selectedUnit === unit.unit ? null : unit.unit)
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{unit.unit}</CardTitle>
                <Badge
                  className={`${getStatusColor(
                    unit.status
                  )} flex items-center gap-1`}
                >
                  {getStatusIcon(unit.status)}
                  {unit.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Production Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Production</span>
                  <span>
                    {unit.production.toFixed(1)} / {unit.target} t/h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      unit.production >= unit.target
                        ? "bg-green-600"
                        : unit.production >= unit.target * 0.8
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (unit.production / unit.target) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-600" />
                  <span>Efficiency: {unit.efficiency.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-600" />
                  <span>Temp: {unit.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>Power: {unit.power.toLocaleString("id-ID")} kW</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span>Vibration: {unit.vibration} mm/s</span>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedUnit === unit.unit && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Control Panel
                    </Button>
                    {unit.status === "alert" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 text-right">
                Last update: {unit.lastUpdate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Production by Unit */}
      <Card>
        <CardHeader>
          <CardTitle>Current Production by Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="unit"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="production" fill="#dc2626" name="Current (t/h)" />
              <Bar dataKey="target" fill="#e5e7eb" name="Target (t/h)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
