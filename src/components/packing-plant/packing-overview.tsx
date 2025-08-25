"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PackingLine {
  id: string;
  name: string;
  status: "running" | "maintenance" | "idle" | "error";
  current_speed: number;
  target_speed: number;
  efficiency: number;
  product_type: string;
  bags_per_hour: number;
  downtime_today: number;
  last_maintenance: string;
  next_maintenance: string;
}

interface ProductionStats {
  total_bags_today: number;
  total_bags_week: number;
  total_bags_month: number;
  average_efficiency: number;
  downtime_hours: number;
  quality_rate: number;
  energy_consumption: number;
  cost_per_bag: number;
}

interface RealTimeMetric {
  timestamp: string;
  total_production: number;
  active_lines: number;
  efficiency: number;
  quality_rate: number;
  energy_usage: number;
}

const PackingOverview = () => {
  const [packingLines, setPackingLines] = useState<PackingLine[]>([]);
  const [productionStats, setProductionStats] = useState<ProductionStats>({
    total_bags_today: 0,
    total_bags_week: 0,
    total_bags_month: 0,
    average_efficiency: 0,
    downtime_hours: 0,
    quality_rate: 0,
    energy_consumption: 0,
    cost_per_bag: 0,
  });
  const [realTimeData, setRealTimeData] = useState<RealTimeMetric[]>([]);

  // Simulate real-time packing plant data
  useEffect(() => {
    const generatePackingLines = (): PackingLine[] => [
      {
        id: "LINE-001",
        name: "Packing Line 1 - OPC",
        status: "running",
        current_speed: 1200 + Math.random() * 100,
        target_speed: 1300,
        efficiency: 85 + Math.random() * 10,
        product_type: "OPC 50kg",
        bags_per_hour: 1200 + Math.random() * 100,
        downtime_today: 0.5 + Math.random() * 1,
        last_maintenance: "2024-01-10",
        next_maintenance: "2024-01-25",
      },
      {
        id: "LINE-002",
        name: "Packing Line 2 - PPC",
        status: "running",
        current_speed: 1100 + Math.random() * 120,
        target_speed: 1250,
        efficiency: 82 + Math.random() * 12,
        product_type: "PPC 40kg",
        bags_per_hour: 1100 + Math.random() * 120,
        downtime_today: 1.2 + Math.random() * 0.8,
        last_maintenance: "2024-01-08",
        next_maintenance: "2024-01-23",
      },
      {
        id: "LINE-003",
        name: "Packing Line 3 - OPC",
        status: "running",
        current_speed: 1350 + Math.random() * 80,
        target_speed: 1400,
        efficiency: 91 + Math.random() * 8,
        product_type: "OPC 50kg",
        bags_per_hour: 1350 + Math.random() * 80,
        downtime_today: 0.3 + Math.random() * 0.5,
        last_maintenance: "2024-01-12",
        next_maintenance: "2024-01-27",
      },
      {
        id: "LINE-004",
        name: "Packing Line 4 - PSC",
        status: "maintenance",
        current_speed: 0,
        target_speed: 1200,
        efficiency: 0,
        product_type: "PSC 40kg",
        bags_per_hour: 0,
        downtime_today: 4.5,
        last_maintenance: "2024-01-15",
        next_maintenance: "2024-01-30",
      },
      {
        id: "LINE-005",
        name: "Packing Line 5 - OPC",
        status: "running",
        current_speed: 1150 + Math.random() * 110,
        target_speed: 1300,
        efficiency: 86 + Math.random() * 9,
        product_type: "OPC 40kg",
        bags_per_hour: 1150 + Math.random() * 110,
        downtime_today: 0.8 + Math.random() * 0.7,
        last_maintenance: "2024-01-09",
        next_maintenance: "2024-01-24",
      },
      {
        id: "LINE-006",
        name: "Packing Line 6 - PPC",
        status: "running",
        current_speed: 1280 + Math.random() * 90,
        target_speed: 1350,
        efficiency: 89 + Math.random() * 7,
        product_type: "PPC 50kg",
        bags_per_hour: 1280 + Math.random() * 90,
        downtime_today: 0.4 + Math.random() * 0.6,
        last_maintenance: "2024-01-11",
        next_maintenance: "2024-01-26",
      },
      {
        id: "LINE-007",
        name: "Packing Line 7 - OPC",
        status: "idle",
        current_speed: 0,
        target_speed: 1250,
        efficiency: 0,
        product_type: "OPC 25kg",
        bags_per_hour: 0,
        downtime_today: 2.1,
        last_maintenance: "2024-01-07",
        next_maintenance: "2024-01-22",
      },
      {
        id: "LINE-008",
        name: "Packing Line 8 - PSC",
        status: "running",
        current_speed: 1320 + Math.random() * 70,
        target_speed: 1380,
        efficiency: 92 + Math.random() * 6,
        product_type: "PSC 50kg",
        bags_per_hour: 1320 + Math.random() * 70,
        downtime_today: 0.2 + Math.random() * 0.4,
        last_maintenance: "2024-01-13",
        next_maintenance: "2024-01-28",
      },
    ];

    const generateProductionStats = (lines: PackingLine[]): ProductionStats => {
      const runningLines = lines.filter((line) => line.status === "running");
      const totalBagsHour = runningLines.reduce(
        (sum, line) => sum + line.bags_per_hour,
        0
      );
      const avgEfficiency =
        runningLines.length > 0
          ? runningLines.reduce((sum, line) => sum + line.efficiency, 0) /
            runningLines.length
          : 0;

      return {
        total_bags_today: totalBagsHour * 18 + Math.random() * 1000, // 18 hours operation
        total_bags_week: totalBagsHour * 18 * 6 + Math.random() * 5000,
        total_bags_month: totalBagsHour * 18 * 25 + Math.random() * 20000,
        average_efficiency: avgEfficiency,
        downtime_hours: lines.reduce(
          (sum, line) => sum + line.downtime_today,
          0
        ),
        quality_rate: 98.5 + Math.random() * 1.2,
        energy_consumption: runningLines.length * 45 + Math.random() * 20,
        cost_per_bag: 0.52 + Math.random() * 0.08,
      };
    };

    const generateRealTimeData = (): RealTimeMetric[] => {
      const data = [];
      const now = new Date();

      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: timestamp.toISOString().slice(11, 16),
          total_production:
            6000 + Math.random() * 2000 + Math.sin(i * 0.3) * 500,
          active_lines: 6 + Math.floor(Math.random() * 2),
          efficiency: 85 + Math.random() * 10 + Math.sin(i * 0.2) * 3,
          quality_rate: 98 + Math.random() * 1.5,
          energy_usage: 250 + Math.random() * 50 + Math.sin(i * 0.4) * 20,
        });
      }

      return data;
    };

    // Initial data
    const lines = generatePackingLines();
    setPackingLines(lines);
    setProductionStats(generateProductionStats(lines));
    setRealTimeData(generateRealTimeData());

    // Update every 30 seconds
    const interval = setInterval(() => {
      const updatedLines = generatePackingLines();
      setPackingLines(updatedLines);
      setProductionStats(generateProductionStats(updatedLines));

      // Update real-time data with new point
      setRealTimeData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTimestamp = new Date();
        newData.push({
          timestamp: lastTimestamp.toISOString().slice(11, 16),
          total_production: 6000 + Math.random() * 2000,
          active_lines: 6 + Math.floor(Math.random() * 2),
          efficiency: 85 + Math.random() * 10,
          quality_rate: 98 + Math.random() * 1.5,
          energy_usage: 250 + Math.random() * 50,
        });
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "idle":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return "🟢";
      case "maintenance":
        return "🔧";
      case "idle":
        return "⏸️";
      case "error":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 80) return "text-yellow-600";
    if (efficiency >= 70) return "text-orange-600";
    return "text-red-600";
  };

  // Chart data
  const productionByType = [
    { name: "OPC 50kg", value: 35, bags: 15000, color: "#dc2626" },
    { name: "OPC 40kg", value: 25, bags: 10800, color: "#ea580c" },
    { name: "PPC 50kg", value: 20, bags: 8600, color: "#d97706" },
    { name: "PPC 40kg", value: 12, bags: 5200, color: "#ca8a04" },
    { name: "PSC 50kg", value: 8, bags: 3400, color: "#65a30d" },
  ];

  const efficiencyTrend = realTimeData.slice(-12).map((item) => ({
    time: item.timestamp,
    efficiency: item.efficiency,
    production: item.total_production / 100,
    energy: item.energy_usage,
  }));

  const runningLines = packingLines.filter(
    (line) => line.status === "running"
  ).length;
  const totalLines = packingLines.length;

  return (
    <div className="space-y-6">
      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Production Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {productionStats.total_bags_today.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">bags produced</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600">📈 +12.5%</span>
              <span className="text-gray-500 ml-2">vs yesterday</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Lines</p>
              <p className="text-2xl font-bold text-blue-600">
                {runningLines}/{totalLines}
              </p>
              <p className="text-xs text-gray-500">lines operational</p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(runningLines / totalLines) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Efficiency</p>
              <p
                className={`text-2xl font-bold ${getEfficiencyColor(
                  productionStats.average_efficiency
                )}`}
              >
                {productionStats.average_efficiency.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">operational efficiency</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600">📈 +2.3%</span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quality Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {productionStats.quality_rate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">quality compliance</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600">✨ Excellent</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Production Trends and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Production & Efficiency Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="efficiency"
                stroke="#dc2626"
                name="Efficiency %"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="production"
                stroke="#3b82f6"
                name="Production (x100)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                name="Energy (kW)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Production by Product Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productionByType}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {productionByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Packing Lines Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Packing Lines Status
          </h3>
          <Button className="bg-red-600 hover:bg-red-700">
            🔄 Refresh Status
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packingLines.map((line) => (
            <Card
              key={line.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{line.name}</h4>
                  <p className="text-sm text-gray-600">{line.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(line.status)}</span>
                  <Badge className={getStatusColor(line.status)}>
                    {line.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{line.product_type}</span>
                </div>

                {line.status === "running" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium">
                        {Math.round(line.current_speed)}/{line.target_speed}{" "}
                        bags/h
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Efficiency:</span>
                      <span
                        className={`font-medium ${getEfficiencyColor(
                          line.efficiency
                        )}`}
                      >
                        {line.efficiency.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          line.efficiency >= 90
                            ? "bg-green-500"
                            : line.efficiency >= 80
                            ? "bg-yellow-500"
                            : line.efficiency >= 70
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${line.efficiency}%` }}
                      ></div>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Downtime:</span>
                  <span className="font-medium text-orange-600">
                    {line.downtime_today.toFixed(1)}h
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Service:</span>
                  <span className="font-medium text-blue-600">
                    {line.next_maintenance}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Weekly Production</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {(productionStats.total_bags_week / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">bags this week</p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                📊 Target: 485K bags
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Energy Consumption</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {productionStats.energy_consumption.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">kW average</p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                ⚡ -8.2% vs target
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Cost Efficiency</h4>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              ${productionStats.cost_per_bag.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">cost per bag</p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-red-50 text-red-700">
                💰 -3.1% vs last month
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PackingOverview;
