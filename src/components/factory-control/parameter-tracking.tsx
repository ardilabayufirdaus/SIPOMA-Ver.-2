"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Filter,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

interface Parameter {
  id: string;
  name: string;
  unit: string;
  category: "temperature" | "pressure" | "flow" | "composition" | "mechanical";
  location: string;
  current: number;
  target: number;
  min: number;
  max: number;
  trend: "up" | "down" | "stable";
  deviation: number;
  lastUpdate: string;
  status: "normal" | "warning" | "critical";
  alarmEnabled: boolean;
}

interface ParameterHistory {
  timestamp: string;
  temperature: number;
  pressure: number;
  flow: number;
  composition: number;
}

const mockParameters: Parameter[] = [
  {
    id: "temp_001",
    name: "Kiln Inlet Temperature",
    unit: "°C",
    category: "temperature",
    location: "Kiln #1",
    current: 850,
    target: 860,
    min: 800,
    max: 900,
    trend: "stable",
    deviation: -1.2,
    lastUpdate: "30 seconds ago",
    status: "normal",
    alarmEnabled: true,
  },
  {
    id: "temp_002",
    name: "Kiln Burning Zone Temperature",
    unit: "°C",
    category: "temperature",
    location: "Kiln #1",
    current: 1465,
    target: 1450,
    min: 1400,
    max: 1500,
    trend: "up",
    deviation: 1.0,
    lastUpdate: "15 seconds ago",
    status: "warning",
    alarmEnabled: true,
  },
  {
    id: "pres_001",
    name: "Preheater Pressure",
    unit: "mbar",
    category: "pressure",
    location: "Preheater Tower",
    current: -25,
    target: -30,
    min: -40,
    max: -20,
    trend: "up",
    deviation: 16.7,
    lastUpdate: "45 seconds ago",
    status: "warning",
    alarmEnabled: true,
  },
  {
    id: "flow_001",
    name: "Raw Material Feed Rate",
    unit: "t/h",
    category: "flow",
    location: "Raw Mill",
    current: 135,
    target: 130,
    min: 100,
    max: 150,
    trend: "stable",
    deviation: 3.8,
    lastUpdate: "1 minute ago",
    status: "normal",
    alarmEnabled: true,
  },
  {
    id: "comp_001",
    name: "LSF (Lime Saturation Factor)",
    unit: "%",
    category: "composition",
    location: "Quality Lab",
    current: 94.2,
    target: 95.0,
    min: 92,
    max: 98,
    trend: "down",
    deviation: -0.8,
    lastUpdate: "5 minutes ago",
    status: "normal",
    alarmEnabled: true,
  },
  {
    id: "mech_001",
    name: "Mill Drive Power",
    unit: "kW",
    category: "mechanical",
    location: "Cement Mill #1",
    current: 4350,
    target: 4200,
    min: 3500,
    max: 5000,
    trend: "up",
    deviation: 3.6,
    lastUpdate: "20 seconds ago",
    status: "normal",
    alarmEnabled: true,
  },
];

const mockHistoryData: ParameterHistory[] = [
  {
    timestamp: "10:00",
    temperature: 1448,
    pressure: -28,
    flow: 132,
    composition: 94.8,
  },
  {
    timestamp: "10:15",
    temperature: 1452,
    pressure: -26,
    flow: 135,
    composition: 94.5,
  },
  {
    timestamp: "10:30",
    temperature: 1455,
    pressure: -25,
    flow: 133,
    composition: 94.2,
  },
  {
    timestamp: "10:45",
    temperature: 1458,
    pressure: -24,
    flow: 138,
    composition: 94.0,
  },
  {
    timestamp: "11:00",
    temperature: 1462,
    pressure: -23,
    flow: 135,
    composition: 94.2,
  },
  {
    timestamp: "11:15",
    temperature: 1465,
    pressure: -25,
    flow: 137,
    composition: 94.1,
  },
];

export default function ParameterTracking() {
  const [parameters, setParameters] = useState<Parameter[]>(mockParameters);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(
    null
  );

  useEffect(() => {
    // Simulate real-time parameter updates
    const interval = setInterval(() => {
      setParameters((prev) =>
        prev.map((param) => {
          const change = (Math.random() - 0.5) * (param.max - param.min) * 0.05;
          const newValue = Math.max(
            param.min,
            Math.min(param.max, param.current + change)
          );
          const newDeviation = ((newValue - param.target) / param.target) * 100;

          return {
            ...param,
            current: newValue,
            deviation: newDeviation,
            trend: change > 0.5 ? "up" : change < -0.5 ? "down" : "stable",
            status:
              Math.abs(newDeviation) > 10
                ? "critical"
                : Math.abs(newDeviation) > 5
                ? "warning"
                : "normal",
            lastUpdate: "Just now",
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case "stable":
        return <Activity className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "temperature":
        return "text-red-600";
      case "pressure":
        return "text-blue-600";
      case "flow":
        return "text-green-600";
      case "composition":
        return "text-purple-600";
      case "mechanical":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredParameters =
    selectedCategory === "all"
      ? parameters
      : parameters.filter((param) => param.category === selectedCategory);

  const categories = [
    "all",
    "temperature",
    "pressure",
    "flow",
    "composition",
    "mechanical",
  ];

  const normalCount = parameters.filter((p) => p.status === "normal").length;
  const warningCount = parameters.filter((p) => p.status === "warning").length;
  const criticalCount = parameters.filter(
    (p) => p.status === "critical"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{normalCount}</p>
              <p className="text-sm text-gray-600">Normal Parameters</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
              <p className="text-sm text-gray-600">Warning Parameters</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {criticalCount}
              </p>
              <p className="text-sm text-gray-600">Critical Parameters</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {parameters.length}
              </p>
              <p className="text-sm text-gray-600">Total Parameters</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Process Parameters
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>

              {/* Parameters Grid */}
              <div className="space-y-4">
                {filteredParameters.map((param) => (
                  <div
                    key={param.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedParameter?.id === param.id
                        ? "ring-2 ring-red-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() =>
                      setSelectedParameter(
                        selectedParameter?.id === param.id ? null : param
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full bg-gray-100 ${getCategoryColor(
                            param.category
                          )}`}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {param.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {param.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(param.trend)}
                        <Badge className={getStatusColor(param.status)}>
                          {param.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current</p>
                        <p className="font-medium">
                          {param.current.toFixed(1)} {param.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Target</p>
                        <p className="font-medium">
                          {param.target.toFixed(1)} {param.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deviation</p>
                        <p
                          className={`font-medium ${
                            Math.abs(param.deviation) < 2
                              ? "text-green-600"
                              : Math.abs(param.deviation) < 5
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {param.deviation > 0 ? "+" : ""}
                          {param.deviation.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Range</p>
                        <p className="font-medium">
                          {param.min} - {param.max}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            param.status === "normal"
                              ? "bg-green-600"
                              : param.status === "warning"
                              ? "bg-yellow-600"
                              : "bg-red-600"
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
                    </div>

                    <div className="mt-2 text-xs text-gray-500 text-right">
                      Last update: {param.lastUpdate}
                    </div>

                    {selectedParameter?.id === param.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            View History
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Set Alarm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Calibrate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parameter Details & Charts */}
        <div className="space-y-6">
          {/* Parameter Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Parameter Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Temperature"
                  />
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Pressure"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Parameter Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>Parameter Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart data={mockHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="temperature" name="Temperature" />
                  <YAxis dataKey="pressure" name="Pressure" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Temp vs Pressure"
                    data={mockHistoryData}
                    fill="#dc2626"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm" variant="outline" className="w-full">
                Generate Report
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Export Data
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Set Alerts
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Calibration Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
