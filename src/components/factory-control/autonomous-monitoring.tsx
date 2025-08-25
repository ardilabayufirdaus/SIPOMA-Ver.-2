"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Eye,
  Camera,
  Thermometer,
  Zap,
  Gauge,
  Cpu,
  Database,
  Cloud,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface AutonomousSystem {
  id: string;
  name: string;
  type: "sensor" | "camera" | "analyzer" | "controller";
  status: "online" | "offline" | "error" | "maintenance";
  location: string;
  lastUpdate: string;
  value: number;
  unit: string;
  threshold: { min: number; max: number };
  confidence: number;
}

interface AlertData {
  id: string;
  timestamp: string;
  system: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  value: number;
  threshold: number;
  status: "active" | "acknowledged" | "resolved";
}

interface TrendData {
  timestamp: string;
  temperature: number;
  pressure: number;
  vibration: number;
  efficiency: number;
}

const mockAutonomousSystems: AutonomousSystem[] = [
  {
    id: "temp_001",
    name: "Kiln Temperature Sensor",
    type: "sensor",
    status: "online",
    location: "Kiln #1 - Burning Zone",
    lastUpdate: "30 seconds ago",
    value: 1450,
    unit: "°C",
    threshold: { min: 1400, max: 1500 },
    confidence: 98.5,
  },
  {
    id: "cam_001",
    name: "Clinker Quality Camera",
    type: "camera",
    status: "online",
    location: "Kiln #1 - Discharge",
    lastUpdate: "1 minute ago",
    value: 85,
    unit: "% Quality",
    threshold: { min: 80, max: 100 },
    confidence: 94.2,
  },
  {
    id: "vib_001",
    name: "Mill Vibration Sensor",
    type: "sensor",
    status: "error",
    location: "Cement Mill #1",
    lastUpdate: "5 minutes ago",
    value: 4.2,
    unit: "mm/s",
    threshold: { min: 0, max: 3.5 },
    confidence: 76.8,
  },
  {
    id: "ana_001",
    name: "Cement Composition Analyzer",
    type: "analyzer",
    status: "online",
    location: "Quality Lab",
    lastUpdate: "2 minutes ago",
    value: 97.3,
    unit: "% Compliance",
    threshold: { min: 95, max: 100 },
    confidence: 99.1,
  },
  {
    id: "ctrl_001",
    name: "Feed Rate Controller",
    type: "controller",
    status: "maintenance",
    location: "Raw Mill #1",
    lastUpdate: "30 minutes ago",
    value: 0,
    unit: "t/h",
    threshold: { min: 100, max: 150 },
    confidence: 0,
  },
  {
    id: "pres_001",
    name: "Mill Pressure Sensor",
    type: "sensor",
    status: "online",
    location: "Cement Mill #2",
    lastUpdate: "45 seconds ago",
    value: 2.3,
    unit: "bar",
    threshold: { min: 2.0, max: 3.0 },
    confidence: 96.7,
  },
];

const mockAlerts: AlertData[] = [
  {
    id: "alert_001",
    timestamp: "2024-01-15T10:30:00Z",
    system: "Mill Vibration Sensor",
    severity: "high",
    message: "Vibration level exceeds threshold",
    value: 4.2,
    threshold: 3.5,
    status: "active",
  },
  {
    id: "alert_002",
    timestamp: "2024-01-15T09:45:00Z",
    system: "Kiln Temperature Sensor",
    severity: "medium",
    message: "Temperature approaching upper limit",
    value: 1485,
    threshold: 1500,
    status: "acknowledged",
  },
  {
    id: "alert_003",
    timestamp: "2024-01-15T08:20:00Z",
    system: "Cement Composition Analyzer",
    severity: "low",
    message: "Minor deviation in C3S content",
    value: 94.2,
    threshold: 95.0,
    status: "resolved",
  },
];

const mockTrendData: TrendData[] = [
  {
    timestamp: "10:00",
    temperature: 1445,
    pressure: 2.2,
    vibration: 2.1,
    efficiency: 95.2,
  },
  {
    timestamp: "10:05",
    temperature: 1448,
    pressure: 2.3,
    vibration: 2.3,
    efficiency: 94.8,
  },
  {
    timestamp: "10:10",
    temperature: 1452,
    pressure: 2.4,
    vibration: 2.5,
    efficiency: 94.5,
  },
  {
    timestamp: "10:15",
    temperature: 1455,
    pressure: 2.3,
    vibration: 2.8,
    efficiency: 93.9,
  },
  {
    timestamp: "10:20",
    temperature: 1458,
    pressure: 2.2,
    vibration: 3.2,
    efficiency: 93.2,
  },
  {
    timestamp: "10:25",
    temperature: 1460,
    pressure: 2.5,
    vibration: 3.8,
    efficiency: 92.1,
  },
  {
    timestamp: "10:30",
    temperature: 1462,
    pressure: 2.6,
    vibration: 4.2,
    efficiency: 90.8,
  },
];

export default function AutonomousMonitoring() {
  const [systems, setSystems] = useState<AutonomousSystem[]>(
    mockAutonomousSystems
  );
  const [alerts, setAlerts] = useState<AlertData[]>(mockAlerts);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time system updates
    const interval = setInterval(() => {
      setSystems((prev) =>
        prev.map((system) => ({
          ...system,
          value:
            system.status === "online"
              ? system.value + (Math.random() - 0.5) * (system.value * 0.05)
              : system.value,
          confidence:
            system.status === "online"
              ? Math.max(
                  85,
                  Math.min(99.9, system.confidence + (Math.random() - 0.5) * 5)
                )
              : system.confidence,
          lastUpdate:
            system.status === "online" ? "Just now" : system.lastUpdate,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4" />;
      case "offline":
        return <WifiOff className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case "sensor":
        return <Gauge className="h-5 w-5" />;
      case "camera":
        return <Camera className="h-5 w-5" />;
      case "analyzer":
        return <Database className="h-5 w-5" />;
      case "controller":
        return <Cpu className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "acknowledged" } : alert
      )
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" } : alert
      )
    );
  };

  const onlineSystemsCount = systems.filter(
    (s) => s.status === "online"
  ).length;
  const errorSystemsCount = systems.filter((s) => s.status === "error").length;
  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {onlineSystemsCount}
              </p>
              <p className="text-sm text-gray-600">Systems Online</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {errorSystemsCount}
              </p>
              <p className="text-sm text-gray-600">System Errors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {activeAlertsCount}
              </p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Cloud className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">98.2%</p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Systems Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Status Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Autonomous Systems Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systems.map((system) => (
                  <div
                    key={system.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSystem === system.id
                        ? "ring-2 ring-red-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() =>
                      setSelectedSystem(
                        selectedSystem === system.id ? null : system.id
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getSystemIcon(system.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {system.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {system.location}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          system.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(system.status)}
                        {system.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Current Value
                        </span>
                        <span className="font-medium">
                          {system.value.toFixed(1)} {system.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Confidence
                        </span>
                        <span className="font-medium">
                          {system.confidence.toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            system.value >= system.threshold.min &&
                            system.value <= system.threshold.max
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (system.confidence / 100) * 100
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="text-xs text-gray-500">
                        Range: {system.threshold.min} - {system.threshold.max}{" "}
                        {system.unit}
                      </div>

                      <div className="text-xs text-gray-500">
                        Last update: {system.lastUpdate}
                      </div>
                    </div>

                    {selectedSystem === system.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Calibrate
                          </Button>
                          {system.status === "error" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600"
                            >
                              Diagnose
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Parameter Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stackId="1"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.3}
                    name="Temperature (°C)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pressure"
                    stackId="2"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.3}
                    name="Pressure (bar)"
                  />
                  <Area
                    type="monotone"
                    dataKey="vibration"
                    stackId="3"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.3}
                    name="Vibration (mm/s)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          alert.status === "active"
                            ? "text-red-600 border-red-600"
                            : alert.status === "acknowledged"
                            ? "text-yellow-600 border-yellow-600"
                            : "text-green-600 border-green-600"
                        }
                      >
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-1">
                      {alert.system}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.message}
                    </p>

                    <div className="text-xs text-gray-500 mb-3">
                      Value: {alert.value} | Threshold: {alert.threshold}
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      {new Date(alert.timestamp).toLocaleString("id-ID")}
                    </div>

                    {alert.status === "active" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex-1"
                        >
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                          className="flex-1 text-green-600 border-green-600"
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Pattern Detected
                  </p>
                  <p className="text-sm text-blue-700">
                    Mill vibration increasing gradually over last 2 hours.
                    Recommend inspection.
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    Optimization Opportunity
                  </p>
                  <p className="text-sm text-green-700">
                    Feed rate can be increased by 5% based on current
                    conditions.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">
                    Maintenance Prediction
                  </p>
                  <p className="text-sm text-yellow-700">
                    Sensor calibration needed for Kiln Temperature in 3 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
