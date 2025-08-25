"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Battery,
  Gauge,
  DollarSign,
  Leaf,
  Target,
  BarChart3,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface EnergyConsumer {
  id: string;
  name: string;
  type: "motor" | "kiln" | "mill" | "fan" | "pump" | "lighting";
  power: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
  powerFactor: number;
  voltage: number;
  current: number;
  energyToday: number;
  cost: number;
  co2Emission: number;
  location: string;
}

interface EnergyTrend {
  time: string;
  totalPower: number;
  cementMill: number;
  rawMill: number;
  kiln: number;
  auxiliary: number;
  cost: number;
}

interface PowerQuality {
  parameter: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "poor";
  limit: number;
}

const mockEnergyConsumers: EnergyConsumer[] = [
  {
    id: "ec_001",
    name: "Cement Mill #1 Drive",
    type: "mill",
    power: 4250,
    efficiency: 92.5,
    status: "online",
    powerFactor: 0.85,
    voltage: 6600,
    current: 350,
    energyToday: 85600,
    cost: 6848,
    co2Emission: 42.8,
    location: "Mill House #1",
  },
  {
    id: "ec_002",
    name: "Cement Mill #2 Drive",
    type: "mill",
    power: 4180,
    efficiency: 94.2,
    status: "online",
    powerFactor: 0.87,
    voltage: 6600,
    current: 340,
    energyToday: 83600,
    cost: 6688,
    co2Emission: 41.8,
    location: "Mill House #2",
  },
  {
    id: "ec_003",
    name: "Raw Mill Drive",
    type: "mill",
    power: 0,
    efficiency: 0,
    status: "maintenance",
    powerFactor: 0,
    voltage: 0,
    current: 0,
    energyToday: 45200,
    cost: 3616,
    co2Emission: 22.6,
    location: "Raw Mill House",
  },
  {
    id: "ec_004",
    name: "Rotary Kiln Drive",
    type: "kiln",
    power: 320,
    efficiency: 96.8,
    status: "online",
    powerFactor: 0.92,
    voltage: 6600,
    current: 28,
    energyToday: 7680,
    cost: 614,
    co2Emission: 3.8,
    location: "Kiln House",
  },
  {
    id: "ec_005",
    name: "Kiln Main Fan",
    type: "fan",
    power: 1850,
    efficiency: 88.5,
    status: "online",
    powerFactor: 0.83,
    voltage: 6600,
    current: 160,
    energyToday: 44400,
    cost: 3552,
    co2Emission: 22.2,
    location: "Kiln House",
  },
  {
    id: "ec_006",
    name: "Coal Mill Drive",
    type: "mill",
    power: 1650,
    efficiency: 91.2,
    status: "online",
    powerFactor: 0.86,
    voltage: 6600,
    current: 142,
    energyToday: 39600,
    cost: 3168,
    co2Emission: 19.8,
    location: "Coal Mill House",
  },
];

const mockEnergyTrend: EnergyTrend[] = [
  {
    time: "00:00",
    totalPower: 12850,
    cementMill: 8430,
    rawMill: 2200,
    kiln: 2170,
    auxiliary: 50,
    cost: 1028,
  },
  {
    time: "04:00",
    totalPower: 12920,
    cementMill: 8480,
    rawMill: 2250,
    kiln: 2140,
    auxiliary: 50,
    cost: 1034,
  },
  {
    time: "08:00",
    totalPower: 10650,
    cementMill: 8430,
    rawMill: 0,
    kiln: 2170,
    auxiliary: 50,
    cost: 852,
  },
  {
    time: "12:00",
    totalPower: 10720,
    cementMill: 8500,
    rawMill: 0,
    kiln: 2170,
    auxiliary: 50,
    cost: 858,
  },
  {
    time: "16:00",
    totalPower: 10680,
    cementMill: 8460,
    rawMill: 0,
    kiln: 2170,
    auxiliary: 50,
    cost: 854,
  },
  {
    time: "20:00",
    totalPower: 10740,
    cementMill: 8520,
    rawMill: 0,
    kiln: 2170,
    auxiliary: 50,
    cost: 859,
  },
];

const mockPowerQuality: PowerQuality[] = [
  {
    parameter: "Voltage THD",
    value: 2.8,
    unit: "%",
    status: "good",
    limit: 5.0,
  },
  {
    parameter: "Current THD",
    value: 4.2,
    unit: "%",
    status: "good",
    limit: 8.0,
  },
  {
    parameter: "Power Factor",
    value: 0.86,
    unit: "",
    status: "warning",
    limit: 0.9,
  },
  {
    parameter: "Voltage Unbalance",
    value: 1.5,
    unit: "%",
    status: "good",
    limit: 2.0,
  },
  {
    parameter: "Frequency",
    value: 50.02,
    unit: "Hz",
    status: "good",
    limit: 50.5,
  },
];

const COLORS = ["#dc2626", "#16a34a", "#2563eb", "#f59e0b", "#8b5cf6"];

export default function EnergyMonitoring() {
  const [energyData, setEnergyData] =
    useState<EnergyConsumer[]>(mockEnergyConsumers);
  const [selectedConsumer, setSelectedConsumer] =
    useState<EnergyConsumer | null>(null);
  const [viewMode, setViewMode] = useState<"power" | "cost" | "efficiency">(
    "power"
  );

  useEffect(() => {
    // Simulate real-time energy data updates
    const interval = setInterval(() => {
      setEnergyData((prev) =>
        prev.map((consumer) => ({
          ...consumer,
          power:
            consumer.status === "online"
              ? Math.max(
                  0,
                  consumer.power + (Math.random() - 0.5) * consumer.power * 0.05
                )
              : consumer.power,
          efficiency:
            consumer.status === "online"
              ? Math.max(
                  80,
                  Math.min(98, consumer.efficiency + (Math.random() - 0.5) * 2)
                )
              : consumer.efficiency,
          powerFactor:
            consumer.status === "online"
              ? Math.max(
                  0.75,
                  Math.min(
                    0.95,
                    consumer.powerFactor + (Math.random() - 0.5) * 0.05
                  )
                )
              : consumer.powerFactor,
          current:
            consumer.status === "online"
              ? consumer.power /
                ((consumer.voltage * Math.sqrt(3) * consumer.powerFactor) /
                  1000)
              : 0,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getPowerFactorColor = (pf: number) => {
    if (pf >= 0.9) return "text-green-600";
    if (pf >= 0.85) return "text-yellow-600";
    return "text-red-600";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mill":
        return <Gauge className="h-5 w-5" />;
      case "kiln":
        return <Zap className="h-5 w-5" />;
      case "fan":
        return <Target className="h-5 w-5" />;
      case "pump":
        return <Battery className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const totalPower = energyData.reduce(
    (sum, consumer) => sum + consumer.power,
    0
  );
  const totalCost = energyData.reduce(
    (sum, consumer) => sum + consumer.cost,
    0
  );
  const totalCO2 = energyData.reduce(
    (sum, consumer) => sum + consumer.co2Emission,
    0
  );
  const avgEfficiency =
    energyData.reduce((sum, consumer) => sum + consumer.efficiency, 0) /
    energyData.length;

  const pieData = energyData
    .filter((consumer) => consumer.power > 0)
    .map((consumer) => ({
      name: consumer.name,
      value: consumer.power,
      type: consumer.type,
    }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Zap className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {totalPower.toFixed(0)} kW
              </p>
              <p className="text-sm text-gray-600">Total Power</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ${totalCost.toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Daily Cost</p>
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
            <Leaf className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {totalCO2.toFixed(1)} t
              </p>
              <p className="text-sm text-gray-600">CO₂ Emissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Consumers */}
        <div className="lg:col-span-2 space-y-6">
          {/* View Mode Selector */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Energy Consumers
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === "power" ? "default" : "outline"}
                onClick={() => setViewMode("power")}
              >
                Power
              </Button>
              <Button
                size="sm"
                variant={viewMode === "cost" ? "default" : "outline"}
                onClick={() => setViewMode("cost")}
              >
                Cost
              </Button>
              <Button
                size="sm"
                variant={viewMode === "efficiency" ? "default" : "outline"}
                onClick={() => setViewMode("efficiency")}
              >
                Efficiency
              </Button>
            </div>
          </div>

          {/* Consumers Grid */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {energyData.map((consumer) => (
                  <div
                    key={consumer.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedConsumer?.id === consumer.id
                        ? "ring-2 ring-red-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() =>
                      setSelectedConsumer(
                        selectedConsumer?.id === consumer.id ? null : consumer
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100 text-red-600">
                          {getTypeIcon(consumer.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {consumer.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {consumer.location}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(consumer.status)}>
                        {consumer.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Power</p>
                        <p className="font-medium">
                          {consumer.power.toFixed(0)} kW
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Efficiency</p>
                        <p
                          className={`font-medium ${getEfficiencyColor(
                            consumer.efficiency
                          )}`}
                        >
                          {consumer.efficiency.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Power Factor</p>
                        <p
                          className={`font-medium ${getPowerFactorColor(
                            consumer.powerFactor
                          )}`}
                        >
                          {consumer.powerFactor.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Daily Cost</p>
                        <p className="font-medium">
                          ${consumer.cost.toFixed(0)}
                        </p>
                      </div>
                    </div>

                    {/* Power Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            consumer.efficiency >= 95
                              ? "bg-green-600"
                              : consumer.efficiency >= 90
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{
                            width: `${
                              consumer.status === "online"
                                ? (consumer.power / 5000) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {selectedConsumer?.id === consumer.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Voltage</p>
                            <p className="font-medium">
                              {consumer.voltage.toLocaleString("id-ID")} V
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Current</p>
                            <p className="font-medium">
                              {consumer.current.toFixed(0)} A
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">CO₂ Today</p>
                            <p className="font-medium">
                              {consumer.co2Emission.toFixed(1)} t
                            </p>
                          </div>
                        </div>
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
                            Set Limits
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            History
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Trend - Last 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockEnergyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cementMill"
                    stackId="1"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.7}
                    name="Cement Mills (kW)"
                  />
                  <Area
                    type="monotone"
                    dataKey="rawMill"
                    stackId="1"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.7}
                    name="Raw Mill (kW)"
                  />
                  <Area
                    type="monotone"
                    dataKey="kiln"
                    stackId="1"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.7}
                    name="Kiln (kW)"
                  />
                  <Area
                    type="monotone"
                    dataKey="auxiliary"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.7}
                    name="Auxiliary (kW)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Control */}
        <div className="space-y-6">
          {/* Power Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Power Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${value.toFixed(0)} kW`}
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

          {/* Power Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Power Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPowerQuality.map((quality, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quality.parameter}
                      </p>
                      <p className="text-xs text-gray-500">
                        Limit: {quality.limit} {quality.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {quality.value.toFixed(2)} {quality.unit}
                      </p>
                      <Badge
                        className={
                          quality.status === "good"
                            ? "bg-green-100 text-green-800"
                            : quality.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {quality.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy KPIs */}
          <Card>
            <CardHeader>
              <CardTitle>Energy KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Specific Energy Consumption
                  </span>
                  <span className="text-sm font-medium">92.5 kWh/t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Energy Cost per Ton
                  </span>
                  <span className="text-sm font-medium">$7.40/t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Power Factor (Avg)
                  </span>
                  <span className="text-sm font-medium">0.86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Load Factor</span>
                  <span className="text-sm font-medium">78.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm" variant="outline" className="w-full">
                Energy Report
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Load Scheduling
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Demand Forecast
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Carbon Footprint
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
