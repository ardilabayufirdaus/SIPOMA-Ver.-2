"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Factory,
  Gauge,
  Thermometer,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Mill {
  id: string;
  name: string;
  type: "cement" | "raw" | "coal";
  status: "running" | "stopped" | "starting" | "stopping" | "maintenance";
  production: number;
  target: number;
  efficiency: number;
  power: number;
  temperature: number;
  vibration: number;
  pressure: number;
  feedRate: number;
  speed: number;
  lastMaintenance: string;
  nextMaintenance: string;
  operatingHours: number;
}

interface MillParameter {
  name: string;
  current: number;
  setpoint: number;
  min: number;
  max: number;
  unit: string;
  controllable: boolean;
}

interface ProductionHistory {
  time: string;
  mill1: number;
  mill2: number;
  rawMill: number;
}

const mockMills: Mill[] = [
  {
    id: "mill_001",
    name: "Cement Mill #1",
    type: "cement",
    status: "running",
    production: 85,
    target: 90,
    efficiency: 94.4,
    power: 4200,
    temperature: 75,
    vibration: 2.3,
    pressure: 2.1,
    feedRate: 120,
    speed: 15.2,
    lastMaintenance: "2024-01-01",
    nextMaintenance: "2024-03-01",
    operatingHours: 1580,
  },
  {
    id: "mill_002",
    name: "Cement Mill #2",
    type: "cement",
    status: "running",
    production: 92,
    target: 90,
    efficiency: 102.2,
    power: 4350,
    temperature: 73,
    vibration: 1.8,
    pressure: 2.3,
    feedRate: 125,
    speed: 15.8,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-03-10",
    operatingHours: 1420,
  },
  {
    id: "mill_003",
    name: "Raw Mill #1",
    type: "raw",
    status: "maintenance",
    production: 0,
    target: 120,
    efficiency: 0,
    power: 0,
    temperature: 45,
    vibration: 0,
    pressure: 0,
    feedRate: 0,
    speed: 0,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    operatingHours: 2150,
  },
  {
    id: "mill_004",
    name: "Coal Mill #1",
    type: "coal",
    status: "running",
    production: 45,
    target: 50,
    efficiency: 90,
    power: 1800,
    temperature: 85,
    vibration: 1.5,
    pressure: 1.8,
    feedRate: 55,
    speed: 12.5,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
    operatingHours: 950,
  },
];

const mockMillParameters: MillParameter[] = [
  {
    name: "Feed Rate",
    current: 120,
    setpoint: 125,
    min: 80,
    max: 150,
    unit: "t/h",
    controllable: true,
  },
  {
    name: "Mill Speed",
    current: 15.2,
    setpoint: 15.5,
    min: 12,
    max: 18,
    unit: "rpm",
    controllable: true,
  },
  {
    name: "Separator Speed",
    current: 750,
    setpoint: 750,
    min: 600,
    max: 900,
    unit: "rpm",
    controllable: true,
  },
  {
    name: "Mill Pressure",
    current: 2.1,
    setpoint: 2.2,
    min: 1.5,
    max: 3.0,
    unit: "bar",
    controllable: true,
  },
  {
    name: "Mill Load",
    current: 85,
    setpoint: 88,
    min: 70,
    max: 95,
    unit: "%",
    controllable: false,
  },
  {
    name: "Power Draw",
    current: 4200,
    setpoint: 4000,
    min: 3000,
    max: 5000,
    unit: "kW",
    controllable: false,
  },
];

const mockProductionHistory: ProductionHistory[] = [
  { time: "00:00", mill1: 88, mill2: 92, rawMill: 115 },
  { time: "02:00", mill1: 86, mill2: 89, rawMill: 118 },
  { time: "04:00", mill1: 90, mill2: 94, rawMill: 120 },
  { time: "06:00", mill1: 85, mill2: 90, rawMill: 0 },
  { time: "08:00", mill1: 87, mill2: 93, rawMill: 0 },
  { time: "10:00", mill1: 89, mill2: 95, rawMill: 0 },
  { time: "12:00", mill1: 85, mill2: 92, rawMill: 0 },
];

const COLORS = ["#dc2626", "#16a34a", "#2563eb", "#f59e0b"];

export default function MillManagement() {
  const [mills, setMills] = useState<Mill[]>(mockMills);
  const [selectedMill, setSelectedMill] = useState<Mill>(mockMills[0]);
  const [parameters, setParameters] =
    useState<MillParameter[]>(mockMillParameters);
  const [controlMode, setControlMode] = useState<"manual" | "auto">("auto");

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMills((prev) =>
        prev.map((mill) => ({
          ...mill,
          production:
            mill.status === "running"
              ? Math.max(0, mill.production + (Math.random() - 0.5) * 5)
              : mill.production,
          efficiency:
            mill.status === "running"
              ? Math.max(0, mill.efficiency + (Math.random() - 0.5) * 2)
              : mill.efficiency,
          power:
            mill.status === "running"
              ? mill.power + (Math.random() - 0.5) * 100
              : mill.power,
          temperature:
            mill.status === "running"
              ? mill.temperature + (Math.random() - 0.5) * 3
              : mill.temperature,
          vibration:
            mill.status === "running"
              ? Math.max(0, mill.vibration + (Math.random() - 0.5) * 0.3)
              : mill.vibration,
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
      case "starting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "stopping":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4" />;
      case "stopped":
        return <Square className="h-4 w-4" />;
      case "starting":
        return <RotateCcw className="h-4 w-4" />;
      case "stopping":
        return <Pause className="h-4 w-4" />;
      case "maintenance":
        return <Settings className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getMillTypeColor = (type: string) => {
    switch (type) {
      case "cement":
        return "text-red-600";
      case "raw":
        return "text-green-600";
      case "coal":
        return "text-gray-600";
      default:
        return "text-blue-600";
    }
  };

  const handleParameterChange = (paramName: string, newValue: number) => {
    setParameters((prev) =>
      prev.map((param) =>
        param.name === paramName ? { ...param, setpoint: newValue } : param
      )
    );
  };

  const handleMillControl = (action: "start" | "stop" | "maintenance") => {
    console.log(`${action} mill:`, selectedMill.id);
    // Implement mill control logic
  };

  const runningMills = mills.filter((mill) => mill.status === "running").length;
  const totalProduction = mills.reduce((sum, mill) => sum + mill.production, 0);
  const avgEfficiency =
    mills.reduce((sum, mill) => sum + mill.efficiency, 0) / mills.length;

  const pieData = mills.map((mill) => ({
    name: mill.name,
    value: mill.production,
    type: mill.type,
  }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Factory className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{runningMills}</p>
              <p className="text-sm text-gray-600">Mills Running</p>
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
                {avgEfficiency.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Avg Efficiency</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Zap className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {mills
                  .reduce((sum, mill) => sum + mill.power, 0)
                  .toLocaleString("id-ID")}{" "}
                kW
              </p>
              <p className="text-sm text-gray-600">Total Power</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mill Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mill Status Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Mill Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mills.map((mill) => (
                  <div
                    key={mill.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMill.id === mill.id
                        ? "ring-2 ring-red-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedMill(mill)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Factory
                          className={`h-5 w-5 ${getMillTypeColor(mill.type)}`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {mill.name}
                          </h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {mill.type} Mill
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          mill.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(mill.status)}
                        {mill.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Production
                        </span>
                        <span className="font-medium">
                          {mill.production.toFixed(1)} / {mill.target} t/h
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            mill.production >= mill.target * 0.9
                              ? "bg-green-600"
                              : mill.production >= mill.target * 0.7
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (mill.production / mill.target) * 100
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Efficiency</p>
                          <p className="font-medium">
                            {mill.efficiency.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Power</p>
                          <p className="font-medium">
                            {mill.power.toLocaleString("id-ID")} kW
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Vibration</p>
                          <p className="font-medium">
                            {mill.vibration.toFixed(1)} mm/s
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Production History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Production History - Last 12 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockProductionHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mill1"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Cement Mill #1"
                  />
                  <Line
                    type="monotone"
                    dataKey="mill2"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Cement Mill #2"
                  />
                  <Line
                    type="monotone"
                    dataKey="rawMill"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Raw Mill #1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Production Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Current Production Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ${value.toFixed(0)} t/h`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Mill Control Panel */}
        <div className="space-y-6">
          {/* Selected Mill Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory
                  className={`h-5 w-5 ${getMillTypeColor(selectedMill.type)}`}
                />
                {selectedMill.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(selectedMill.status)}>
                  {selectedMill.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-600" />
                  <span>Efficiency: {selectedMill.efficiency.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-600" />
                  <span>Temp: {selectedMill.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>
                    Power: {selectedMill.power.toLocaleString("id-ID")} kW
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Feed: {selectedMill.feedRate} t/h</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Control Mode</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={controlMode === "auto" ? "default" : "outline"}
                      onClick={() => setControlMode("auto")}
                    >
                      Auto
                    </Button>
                    <Button
                      size="sm"
                      variant={controlMode === "manual" ? "default" : "outline"}
                      onClick={() => setControlMode("manual")}
                    >
                      Manual
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600"
                    onClick={() => handleMillControl("start")}
                    disabled={selectedMill.status === "running"}
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600"
                    onClick={() => handleMillControl("stop")}
                    disabled={selectedMill.status === "stopped"}
                  >
                    Stop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameter Control */}
          <Card>
            <CardHeader>
              <CardTitle>Process Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parameters.map((param, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{param.name}</span>
                      <span className="text-sm text-gray-600">
                        {param.current.toFixed(1)} / {param.setpoint.toFixed(1)}{" "}
                        {param.unit}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          Math.abs(param.current - param.setpoint) /
                            param.setpoint <
                          0.05
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                        style={{
                          width: `${
                            ((param.current - param.min) /
                              (param.max - param.min)) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    {param.controllable && controlMode === "manual" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.max > 100 ? 10 : 0.1}
                          value={param.setpoint}
                          onChange={(e) =>
                            handleParameterChange(
                              param.name,
                              parseFloat(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Info */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Last Maintenance</p>
                  <p className="font-medium">
                    {new Date(
                      selectedMill.lastMaintenance
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Maintenance</p>
                  <p className="font-medium">
                    {new Date(
                      selectedMill.nextMaintenance
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operating Hours</p>
                  <p className="font-medium">
                    {selectedMill.operatingHours.toLocaleString("id-ID")} hrs
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleMillControl("maintenance")}
                >
                  Schedule Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
