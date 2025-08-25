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

interface PortMetrics {
  berth_utilization: number;
  vessels_in_port: number;
  total_throughput: number;
  loading_rate: number;
  turnaround_time: number;
  weather_delay_hours: number;
  otif_percentage: number;
  revenue_today: number;
}

interface BerthStatus {
  id: string;
  name: string;
  status: "available" | "occupied" | "maintenance";
  vessel?: string;
  eta?: string;
  etd?: string;
  cargo: string;
  capacity: number;
  utilization: number;
}

interface VesselStatus {
  id: string;
  name: string;
  type: string;
  status: "berthed" | "anchored" | "approaching" | "departing";
  cargo: string;
  tonnage: number;
  eta: string;
  berth?: string;
  progress: number;
}

const PortOverview = () => {
  const [metrics, setMetrics] = useState<PortMetrics>({
    berth_utilization: 0,
    vessels_in_port: 0,
    total_throughput: 0,
    loading_rate: 0,
    turnaround_time: 0,
    weather_delay_hours: 0,
    otif_percentage: 0,
    revenue_today: 0,
  });

  const [berths, setBerths] = useState<BerthStatus[]>([]);
  const [vessels, setVessels] = useState<VesselStatus[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const generateMetrics = (): PortMetrics => ({
      berth_utilization: 65 + Math.random() * 20,
      vessels_in_port: Math.floor(3 + Math.random() * 5),
      total_throughput: 12000 + Math.random() * 3000,
      loading_rate: 800 + Math.random() * 200,
      turnaround_time: 18 + Math.random() * 12,
      weather_delay_hours: Math.random() * 4,
      otif_percentage: 92 + Math.random() * 6,
      revenue_today: 450000 + Math.random() * 100000,
    });

    const generateBerths = (): BerthStatus[] => [
      {
        id: "berth-1",
        name: "Berth 1",
        status: "occupied",
        vessel: "MV Semen Nusantara",
        eta: "2024-01-15 08:00",
        etd: "2024-01-15 20:00",
        cargo: "Cement Bulk",
        capacity: 30000,
        utilization: 75 + Math.random() * 20,
      },
      {
        id: "berth-2",
        name: "Berth 2",
        status: "occupied",
        vessel: "MV Gresik Express",
        eta: "2024-01-15 14:00",
        etd: "2024-01-16 06:00",
        cargo: "Cement Bags",
        capacity: 50000,
        utilization: 60 + Math.random() * 25,
      },
      {
        id: "berth-3",
        name: "Berth 3",
        status: "available",
        cargo: "-",
        capacity: 40000,
        utilization: 0,
      },
    ];

    const generateVessels = (): VesselStatus[] => [
      {
        id: "vessel-1",
        name: "MV Semen Nusantara",
        type: "Bulk Carrier",
        status: "berthed",
        cargo: "Cement Bulk",
        tonnage: 25000,
        eta: "2024-01-15 08:00",
        berth: "Berth 1",
        progress: 65 + Math.random() * 30,
      },
      {
        id: "vessel-2",
        name: "MV Gresik Express",
        type: "General Cargo",
        status: "berthed",
        cargo: "Cement Bags",
        tonnage: 18000,
        eta: "2024-01-15 14:00",
        berth: "Berth 2",
        progress: 40 + Math.random() * 25,
      },
      {
        id: "vessel-3",
        name: "MV Jakarta Pioneer",
        type: "Bulk Carrier",
        status: "approaching",
        cargo: "Clinker",
        tonnage: 32000,
        eta: "2024-01-15 22:00",
        progress: 15 + Math.random() * 10,
      },
      {
        id: "vessel-4",
        name: "MV Surabaya Star",
        type: "Container Ship",
        status: "anchored",
        cargo: "Cement Bags",
        tonnage: 22000,
        eta: "2024-01-16 08:00",
        progress: 0,
      },
    ];

    // Initial data
    setMetrics(generateMetrics());
    setBerths(generateBerths());
    setVessels(generateVessels());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
      setBerths((prev) =>
        prev.map((berth) => ({
          ...berth,
          utilization:
            berth.status === "occupied" ? 60 + Math.random() * 35 : 0,
        }))
      );
      setVessels((prev) =>
        prev.map((vessel) => ({
          ...vessel,
          progress:
            vessel.status === "berthed"
              ? Math.min(95, vessel.progress + Math.random() * 5)
              : vessel.status === "approaching"
              ? Math.min(100, vessel.progress + Math.random() * 3)
              : vessel.progress,
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Chart data
  const throughputData = [
    { hour: "00:00", throughput: 450, target: 500 },
    { hour: "04:00", throughput: 520, target: 500 },
    { hour: "08:00", throughput: 680, target: 500 },
    { hour: "12:00", throughput: 750, target: 500 },
    { hour: "16:00", throughput: 720, target: 500 },
    { hour: "20:00", throughput: 650, target: 500 },
  ];

  const berthUtilizationData = berths.map((berth) => ({
    name: berth.name,
    utilization: berth.utilization,
    capacity: 100,
  }));

  const cargoDistribution = [
    { name: "Cement Bulk", value: 45, color: "#dc2626" },
    { name: "Cement Bags", value: 30, color: "#ef4444" },
    { name: "Clinker", value: 15, color: "#f87171" },
    { name: "Others", value: 10, color: "#fca5a5" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "occupied":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "berthed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "anchored":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "approaching":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "departing":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Berth Utilization
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.berth_utilization.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">⚓</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span
                className={`text-${
                  metrics.berth_utilization > 80 ? "red" : "green"
                }-600`}
              >
                {metrics.berth_utilization > 80 ? "↗" : "↘"}
                {metrics.berth_utilization > 80 ? "High" : "Optimal"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Vessels in Port
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.vessels_in_port}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">🚢</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span>2 berthed, {metrics.vessels_in_port - 2} waiting</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Throughput
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(metrics.total_throughput / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">tons today</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📦</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <span>↗ +12% vs yesterday</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                OTIF Performance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.otif_percentage.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span
                className={`text-${
                  metrics.otif_percentage > 95 ? "green" : "yellow"
                }-600`}
              >
                Target: 95%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Throughput Trend
            </h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Real-time
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="throughput"
                stackId="1"
                stroke="#dc2626"
                fill="#fef2f2"
                name="Actual Throughput"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#6b7280"
                strokeDasharray="5 5"
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Cargo Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Cargo Distribution
            </h3>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Today
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cargoDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {cargoDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Berth Status and Vessel Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Berth Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Berth Status
            </h3>
            <Button size="sm" variant="outline">
              Manage Berths
            </Button>
          </div>
          <div className="space-y-4">
            {berths.map((berth) => (
              <div key={berth.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{berth.name}</h4>
                    <Badge className={getStatusColor(berth.status)}>
                      {berth.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {berth.capacity.toLocaleString()} tons
                  </span>
                </div>

                {berth.vessel && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">
                      <strong>Vessel:</strong> {berth.vessel}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Cargo:</strong> {berth.cargo}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>ETD:</strong> {berth.etd}
                    </p>
                  </div>
                )}

                {berth.status === "occupied" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        Loading Progress
                      </span>
                      <span className="text-xs text-gray-600">
                        {berth.utilization.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${berth.utilization}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Vessel Queue */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Vessel Queue
            </h3>
            <Button size="sm" variant="outline">
              Schedule Vessel
            </Button>
          </div>
          <div className="space-y-4">
            {vessels.map((vessel) => (
              <div key={vessel.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{vessel.name}</h4>
                    <Badge className={getStatusColor(vessel.status)}>
                      {vessel.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {vessel.tonnage.toLocaleString()} tons
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Type:</strong> {vessel.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Cargo:</strong> {vessel.cargo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>ETA:</strong> {vessel.eta}
                    </p>
                    {vessel.berth && (
                      <p className="text-sm text-gray-600">
                        <strong>Berth:</strong> {vessel.berth}
                      </p>
                    )}
                  </div>
                </div>

                {vessel.status !== "anchored" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        {vessel.status === "berthed"
                          ? "Loading Progress"
                          : "Approach Progress"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {vessel.progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${vessel.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={berthUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="utilization"
                  fill="#dc2626"
                  name="Utilization %"
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-2">
              Berth Utilization
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Loading Rate</span>
                <span className="font-medium">
                  {metrics.loading_rate.toFixed(0)} TPH
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(metrics.loading_rate / 1000) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Turnaround</span>
                <span className="font-medium">
                  {metrics.turnaround_time.toFixed(1)} hrs
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.turnaround_time < 24 ? "bg-green-600" : "bg-red-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (metrics.turnaround_time / 48) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weather Delays</span>
                <span className="font-medium">
                  {metrics.weather_delay_hours.toFixed(1)} hrs
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-amber-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (metrics.weather_delay_hours / 12) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              ${(metrics.revenue_today / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 mb-4">Revenue Today</div>
            <div className="text-xs text-gray-500">Target: $500K</div>
            <div className="w-full bg-red-200 rounded-full h-2 mt-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (metrics.revenue_today / 500000) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PortOverview;
