"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Berth {
  id: string;
  name: string;
  number: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  capacity: number;
  length: number;
  depth: number;
  equipment: string[];
  current_vessel?: {
    name: string;
    type: string;
    tonnage: number;
    cargo: string;
    eta: string;
    etd: string;
    progress: number;
  };
  next_vessel?: {
    name: string;
    eta: string;
    cargo: string;
  };
  utilization: number;
  throughput_today: number;
  maintenance_schedule?: {
    type: string;
    scheduled_date: string;
    duration: number;
    description: string;
  };
  performance: {
    avg_turnaround: number;
    loading_rate: number;
    efficiency: number;
    downtime_hours: number;
  };
}

interface BerthSchedule {
  berth_id: string;
  vessel_name: string;
  eta: string;
  etd: string;
  cargo: string;
  tonnage: number;
  status: "scheduled" | "confirmed" | "in_progress" | "completed";
}

const BerthManagement = () => {
  const [berths, setBerths] = useState<Berth[]>([]);
  const [schedule, setSchedule] = useState<BerthSchedule[]>([]);
  const [selectedBerth, setSelectedBerth] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "overview" | "schedule" | "maintenance"
  >("overview");

  // Simulate real-time data updates
  useEffect(() => {
    const generateBerths = (): Berth[] => [
      {
        id: "berth-1",
        name: "Berth 1 - North Wharf",
        number: 1,
        status: "occupied",
        capacity: 30000,
        length: 200,
        depth: 15,
        equipment: ["Ship Loader 1", "Conveyor Belt A", "Dust Suppression"],
        current_vessel: {
          name: "MV Semen Nusantara",
          type: "Bulk Carrier",
          tonnage: 25000,
          cargo: "Cement Bulk",
          eta: "2024-01-15 08:00",
          etd: "2024-01-15 20:00",
          progress: 65 + Math.random() * 20,
        },
        next_vessel: {
          name: "MV Jakarta Pioneer",
          eta: "2024-01-15 22:00",
          cargo: "Clinker",
        },
        utilization: 75 + Math.random() * 15,
        throughput_today: 18500 + Math.random() * 5000,
        performance: {
          avg_turnaround: 14.5,
          loading_rate: 750,
          efficiency: 88,
          downtime_hours: 2.3,
        },
      },
      {
        id: "berth-2",
        name: "Berth 2 - Central Wharf",
        number: 2,
        status: "occupied",
        capacity: 50000,
        length: 250,
        depth: 18,
        equipment: [
          "Ship Loader 2",
          "Conveyor Belt B",
          "Conveyor Belt C",
          "Grab Crane",
        ],
        current_vessel: {
          name: "MV Gresik Express",
          type: "General Cargo",
          tonnage: 18000,
          cargo: "Cement Bags",
          eta: "2024-01-15 14:00",
          etd: "2024-01-16 06:00",
          progress: 40 + Math.random() * 25,
        },
        utilization: 60 + Math.random() * 20,
        throughput_today: 22000 + Math.random() * 8000,
        performance: {
          avg_turnaround: 16.2,
          loading_rate: 820,
          efficiency: 85,
          downtime_hours: 1.8,
        },
      },
      {
        id: "berth-3",
        name: "Berth 3 - South Wharf",
        number: 3,
        status: "maintenance",
        capacity: 40000,
        length: 220,
        depth: 16,
        equipment: ["Mobile Crane", "Conveyor Belt D", "Shore Power"],
        maintenance_schedule: {
          type: "Scheduled Maintenance",
          scheduled_date: "2024-01-15 22:00",
          duration: 8,
          description: "Conveyor belt inspection and lubrication",
        },
        utilization: 0,
        throughput_today: 0,
        performance: {
          avg_turnaround: 15.8,
          loading_rate: 680,
          efficiency: 82,
          downtime_hours: 8.0,
        },
      },
      {
        id: "berth-4",
        name: "Berth 4 - East Wharf",
        number: 4,
        status: "available",
        capacity: 35000,
        length: 210,
        depth: 14,
        equipment: ["Ship Loader 3", "Conveyor Belt E", "Weighbridge"],
        next_vessel: {
          name: "MV Surabaya Star",
          eta: "2024-01-16 08:00",
          cargo: "Cement Bags",
        },
        utilization: 0,
        throughput_today: 0,
        performance: {
          avg_turnaround: 13.9,
          loading_rate: 720,
          efficiency: 90,
          downtime_hours: 0.5,
        },
      },
    ];

    const generateSchedule = (): BerthSchedule[] => [
      {
        berth_id: "berth-1",
        vessel_name: "MV Semen Nusantara",
        eta: "2024-01-15 08:00",
        etd: "2024-01-15 20:00",
        cargo: "Cement Bulk",
        tonnage: 25000,
        status: "in_progress",
      },
      {
        berth_id: "berth-1",
        vessel_name: "MV Jakarta Pioneer",
        eta: "2024-01-15 22:00",
        etd: "2024-01-16 14:00",
        cargo: "Clinker",
        tonnage: 32000,
        status: "confirmed",
      },
      {
        berth_id: "berth-2",
        vessel_name: "MV Gresik Express",
        eta: "2024-01-15 14:00",
        etd: "2024-01-16 06:00",
        cargo: "Cement Bags",
        tonnage: 18000,
        status: "in_progress",
      },
      {
        berth_id: "berth-4",
        vessel_name: "MV Surabaya Star",
        eta: "2024-01-16 08:00",
        etd: "2024-01-16 20:00",
        cargo: "Cement Bags",
        tonnage: 22000,
        status: "scheduled",
      },
      {
        berth_id: "berth-2",
        vessel_name: "MV Ocean Breeze",
        eta: "2024-01-16 14:00",
        etd: "2024-01-17 06:00",
        cargo: "Cement Bulk",
        tonnage: 28000,
        status: "scheduled",
      },
    ];

    // Initial data
    setBerths(generateBerths());
    setSchedule(generateSchedule());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setBerths((prev) =>
        prev.map((berth) => ({
          ...berth,
          current_vessel: berth.current_vessel
            ? {
                ...berth.current_vessel,
                progress: Math.min(
                  95,
                  berth.current_vessel.progress + Math.random() * 3
                ),
              }
            : undefined,
          utilization:
            berth.status === "occupied" ? 60 + Math.random() * 30 : 0,
          throughput_today:
            berth.status === "occupied"
              ? berth.throughput_today + Math.random() * 1000
              : berth.throughput_today,
          performance: {
            ...berth.performance,
            loading_rate:
              berth.performance.loading_rate + (Math.random() - 0.5) * 50,
            efficiency: Math.max(
              70,
              Math.min(
                95,
                berth.performance.efficiency + (Math.random() - 0.5) * 5
              )
            ),
          },
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "occupied":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reserved":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "✅";
      case "occupied":
        return "🚢";
      case "maintenance":
        return "🔧";
      case "reserved":
        return "📅";
      default:
        return "❓";
    }
  };

  // Chart data
  const utilizationData = berths.map((berth) => ({
    name: `Berth ${berth.number}`,
    utilization: berth.utilization,
    efficiency: berth.performance.efficiency,
    target: 80,
  }));

  const throughputData = berths.map((berth) => ({
    name: `Berth ${berth.number}`,
    throughput: berth.throughput_today / 1000,
    capacity: berth.capacity / 1000,
  }));

  const selectedBerthData = selectedBerth
    ? berths.find((b) => b.id === selectedBerth)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Berth Management
          </h2>
          <p className="text-gray-600">Monitor and manage berth operations</p>
        </div>
        <div className="flex gap-2">
          {["overview", "schedule", "maintenance"].map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode as any)}
              className={viewMode === mode ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Berths</p>
              <p className="text-2xl font-bold text-gray-900">
                {berths.length}
              </p>
            </div>
            <span className="text-2xl">⚓</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">
                {berths.filter((b) => b.status === "occupied").length}
              </p>
            </div>
            <span className="text-2xl">🚢</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {berths.filter((b) => b.status === "available").length}
              </p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-red-600">
                {(
                  berths.reduce((sum, b) => sum + b.utilization, 0) /
                  berths.length
                ).toFixed(0)}
                %
              </p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </Card>
      </div>

      {/* Main Content based on view mode */}
      {viewMode === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Berth List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Berth Status
                </h3>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  + Assign Berth
                </Button>
              </div>

              <div className="space-y-4">
                {berths.map((berth) => (
                  <div
                    key={berth.id}
                    className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-100 ${
                      selectedBerth === berth.id
                        ? "ring-2 ring-red-500 bg-red-50"
                        : ""
                    }`}
                    onClick={() => setSelectedBerth(berth.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {getStatusIcon(berth.status)}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {berth.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {berth.capacity.toLocaleString()} tons •{" "}
                            {berth.length}m × {berth.depth}m
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(berth.status)}>
                        {berth.status}
                      </Badge>
                    </div>

                    {berth.current_vessel && (
                      <div className="mb-3 bg-white rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {berth.current_vessel.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {berth.current_vessel.type} •{" "}
                              {berth.current_vessel.cargo}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              ETD: {berth.current_vessel.etd}
                            </p>
                            <p className="text-sm text-gray-600">
                              {berth.current_vessel.tonnage.toLocaleString()}{" "}
                              tons
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">
                              Loading Progress
                            </span>
                            <span className="text-xs text-gray-600">
                              {berth.current_vessel.progress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${berth.current_vessel.progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {berth.next_vessel && (
                      <div className="mb-3 bg-blue-50 rounded p-3">
                        <p className="text-sm font-medium text-blue-900">
                          Next Vessel
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-800">
                            {berth.next_vessel.name}
                          </p>
                          <p className="text-sm text-blue-800">
                            ETA: {berth.next_vessel.eta}
                          </p>
                        </div>
                        <p className="text-sm text-blue-700">
                          {berth.next_vessel.cargo}
                        </p>
                      </div>
                    )}

                    {berth.maintenance_schedule && (
                      <div className="mb-3 bg-yellow-50 rounded p-3">
                        <p className="text-sm font-medium text-yellow-900">
                          Maintenance Scheduled
                        </p>
                        <p className="text-sm text-yellow-800">
                          {berth.maintenance_schedule.type}
                        </p>
                        <p className="text-sm text-yellow-700">
                          {berth.maintenance_schedule.scheduled_date} (
                          {berth.maintenance_schedule.duration}h)
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Utilization:</span>
                        <span className="ml-2 font-medium">
                          {berth.utilization.toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Throughput:</span>
                        <span className="ml-2 font-medium">
                          {(berth.throughput_today / 1000).toFixed(1)}K tons
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Efficiency:</span>
                        <span className="ml-2 font-medium">
                          {berth.performance.efficiency}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Berth Details / Performance */}
          <div className="space-y-6">
            {selectedBerthData ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Berth Details
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBerth(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedBerthData.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Capacity:</span>
                        <span className="ml-2">
                          {selectedBerthData.capacity.toLocaleString()} tons
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Length:</span>
                        <span className="ml-2">
                          {selectedBerthData.length}m
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Depth:</span>
                        <span className="ml-2">{selectedBerthData.depth}m</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <Badge
                          className={`ml-2 ${getStatusColor(
                            selectedBerthData.status
                          )}`}
                        >
                          {selectedBerthData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Equipment
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedBerthData.equipment.map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Performance Metrics
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg Turnaround:</span>
                        <span>
                          {selectedBerthData.performance.avg_turnaround}h
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Loading Rate:</span>
                        <span>
                          {selectedBerthData.performance.loading_rate} TPH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Efficiency:</span>
                        <span>{selectedBerthData.performance.efficiency}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Downtime:</span>
                        <span>
                          {selectedBerthData.performance.downtime_hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Overview
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="utilization"
                      fill="#dc2626"
                      name="Utilization %"
                    />
                    <Bar
                      dataKey="efficiency"
                      fill="#ef4444"
                      name="Efficiency %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        </div>
      )}

      {viewMode === "schedule" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Berth Schedule
            </h3>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              + Schedule Vessel
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Berth</th>
                  <th className="text-left py-3 px-4">Vessel</th>
                  <th className="text-left py-3 px-4">Cargo</th>
                  <th className="text-left py-3 px-4">Tonnage</th>
                  <th className="text-left py-3 px-4">ETA</th>
                  <th className="text-left py-3 px-4">ETD</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => {
                  const berth = berths.find((b) => b.id === item.berth_id);
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          Berth {berth?.number}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.vessel_name}</td>
                      <td className="py-3 px-4">{item.cargo}</td>
                      <td className="py-3 px-4">
                        {item.tonnage.toLocaleString()} tons
                      </td>
                      <td className="py-3 px-4">{item.eta}</td>
                      <td className="py-3 px-4">{item.etd}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {viewMode === "maintenance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Maintenance Schedule
            </h3>
            <div className="space-y-4">
              {berths
                .filter((berth) => berth.maintenance_schedule)
                .map((berth) => (
                  <div key={berth.id} className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {berth.name}
                      </h4>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {berth.maintenance_schedule!.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {berth.maintenance_schedule!.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Scheduled:</span>
                        <span className="ml-2">
                          {berth.maintenance_schedule!.scheduled_date}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2">
                          {berth.maintenance_schedule!.duration} hours
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Throughput Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="throughput"
                  fill="#dc2626"
                  name="Today (K tons)"
                />
                <Bar
                  dataKey="capacity"
                  fill="#fca5a5"
                  name="Capacity (K tons)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BerthManagement;
