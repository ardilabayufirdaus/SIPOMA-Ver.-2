"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LoadingEquipment {
  id: string;
  name: string;
  type: "ship_loader" | "grab_crane" | "conveyor" | "mobile_crane";
  status: "operational" | "maintenance" | "standby" | "fault";
  capacity: number;
  current_load: number;
  efficiency: number;
  location: string;
  maintenance_due: string;
  operating_hours_today: number;
  energy_consumption: number;
  operator: string;
}

interface LoadingSchedule {
  id: string;
  vessel_name: string;
  berth: string;
  cargo_type: string;
  quantity: number;
  equipment_assignment: string[];
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  status: "scheduled" | "active" | "completed" | "delayed";
  loading_rate: number;
  efficiency: number;
  delays: {
    equipment: number;
    weather: number;
    operational: number;
  };
}

interface OptimizationSuggestion {
  id: string;
  type: "equipment" | "schedule" | "route" | "energy";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  savings_estimate: number;
  implementation_effort: "low" | "medium" | "high";
  ai_confidence: number;
}

const LoadingOptimization = () => {
  const [equipment, setEquipment] = useState<LoadingEquipment[]>([]);
  const [schedule, setSchedule] = useState<LoadingSchedule[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "equipment" | "schedule" | "optimization"
  >("equipment");

  // Simulate real-time data updates
  useEffect(() => {
    const generateEquipment = (): LoadingEquipment[] => [
      {
        id: "eq-1",
        name: "Ship Loader 1",
        type: "ship_loader",
        status: "operational",
        capacity: 800,
        current_load: 650 + Math.random() * 100,
        efficiency: 85 + Math.random() * 10,
        location: "Berth 1",
        maintenance_due: "2024-02-15",
        operating_hours_today: 12.5,
        energy_consumption: 1250,
        operator: "Ahmad Wijaya",
      },
      {
        id: "eq-2",
        name: "Ship Loader 2",
        type: "ship_loader",
        status: "operational",
        capacity: 1000,
        current_load: 850 + Math.random() * 80,
        efficiency: 88 + Math.random() * 8,
        location: "Berth 2",
        maintenance_due: "2024-01-25",
        operating_hours_today: 14.2,
        energy_consumption: 1580,
        operator: "Budi Santoso",
      },
      {
        id: "eq-3",
        name: "Grab Crane A",
        type: "grab_crane",
        status: "standby",
        capacity: 600,
        current_load: 0,
        efficiency: 78 + Math.random() * 12,
        location: "Berth 2",
        maintenance_due: "2024-01-30",
        operating_hours_today: 8.0,
        energy_consumption: 680,
        operator: "Sari Dewi",
      },
      {
        id: "eq-4",
        name: "Conveyor Belt A",
        type: "conveyor",
        status: "operational",
        capacity: 500,
        current_load: 420 + Math.random() * 60,
        efficiency: 92 + Math.random() * 5,
        location: "Berth 1",
        maintenance_due: "2024-02-10",
        operating_hours_today: 16.0,
        energy_consumption: 320,
        operator: "Indra Gunawan",
      },
      {
        id: "eq-5",
        name: "Mobile Crane 1",
        type: "mobile_crane",
        status: "maintenance",
        capacity: 400,
        current_load: 0,
        efficiency: 0,
        location: "Workshop",
        maintenance_due: "2024-01-16",
        operating_hours_today: 0,
        energy_consumption: 0,
        operator: "Under Maintenance",
      },
    ];

    const generateSchedule = (): LoadingSchedule[] => [
      {
        id: "sched-1",
        vessel_name: "MV Semen Nusantara",
        berth: "Berth 1",
        cargo_type: "Cement Bulk",
        quantity: 25000,
        equipment_assignment: ["Ship Loader 1", "Conveyor Belt A"],
        scheduled_start: "2024-01-15 08:00",
        scheduled_end: "2024-01-15 18:00",
        actual_start: "2024-01-15 08:15",
        status: "active",
        loading_rate: 2500 + Math.random() * 200,
        efficiency: 85 + Math.random() * 10,
        delays: {
          equipment: 0.25,
          weather: 0,
          operational: 0.5,
        },
      },
      {
        id: "sched-2",
        vessel_name: "MV Gresik Express",
        berth: "Berth 2",
        cargo_type: "Cement Bags",
        quantity: 18000,
        equipment_assignment: ["Ship Loader 2", "Grab Crane A"],
        scheduled_start: "2024-01-15 14:00",
        scheduled_end: "2024-01-15 22:00",
        actual_start: "2024-01-15 14:30",
        status: "active",
        loading_rate: 2200 + Math.random() * 150,
        efficiency: 78 + Math.random() * 12,
        delays: {
          equipment: 0.5,
          weather: 0,
          operational: 0.8,
        },
      },
      {
        id: "sched-3",
        vessel_name: "MV Jakarta Pioneer",
        berth: "Berth 1",
        cargo_type: "Clinker",
        quantity: 32000,
        equipment_assignment: ["Ship Loader 1", "Conveyor Belt A"],
        scheduled_start: "2024-01-15 22:00",
        scheduled_end: "2024-01-16 08:00",
        status: "scheduled",
        loading_rate: 3200,
        efficiency: 90,
        delays: {
          equipment: 0,
          weather: 0,
          operational: 0,
        },
      },
    ];

    const generateSuggestions = (): OptimizationSuggestion[] => [
      {
        id: "opt-1",
        type: "equipment",
        priority: "high",
        title: "Optimize Ship Loader 1 Configuration",
        description:
          "Adjust conveyor speed and loading pattern to increase efficiency by 12%",
        impact: "15% reduction in loading time",
        savings_estimate: 25000,
        implementation_effort: "low",
        ai_confidence: 0.92,
      },
      {
        id: "opt-2",
        type: "schedule",
        priority: "medium",
        title: "Reschedule MV Jakarta Pioneer",
        description:
          "Move loading to Berth 2 to optimize equipment utilization",
        impact: "20% improvement in berth utilization",
        savings_estimate: 18000,
        implementation_effort: "medium",
        ai_confidence: 0.85,
      },
      {
        id: "opt-3",
        type: "energy",
        priority: "medium",
        title: "Energy Consumption Optimization",
        description:
          "Implement demand-based power management for conveyor systems",
        impact: "18% reduction in energy costs",
        savings_estimate: 32000,
        implementation_effort: "high",
        ai_confidence: 0.78,
      },
      {
        id: "opt-4",
        type: "route",
        priority: "low",
        title: "Material Flow Optimization",
        description: "Optimize cargo routing from storage to loading equipment",
        impact: "8% reduction in material handling time",
        savings_estimate: 12000,
        implementation_effort: "medium",
        ai_confidence: 0.71,
      },
    ];

    // Initial data
    setEquipment(generateEquipment());
    setSchedule(generateSchedule());
    setSuggestions(generateSuggestions());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setEquipment((prev) =>
        prev.map((eq) => ({
          ...eq,
          current_load:
            eq.status === "operational"
              ? Math.max(
                  0,
                  Math.min(
                    eq.capacity,
                    eq.current_load + (Math.random() - 0.5) * 50
                  )
                )
              : 0,
          efficiency:
            eq.status === "operational"
              ? Math.max(
                  60,
                  Math.min(100, eq.efficiency + (Math.random() - 0.5) * 3)
                )
              : 0,
          energy_consumption:
            eq.status === "operational"
              ? eq.energy_consumption + Math.random() * 100
              : 0,
        }))
      );

      setSchedule((prev) =>
        prev.map((sched) => ({
          ...sched,
          loading_rate:
            sched.status === "active"
              ? sched.loading_rate + (Math.random() - 0.5) * 100
              : sched.loading_rate,
          efficiency:
            sched.status === "active"
              ? Math.max(
                  60,
                  Math.min(100, sched.efficiency + (Math.random() - 0.5) * 5)
                )
              : sched.efficiency,
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "standby":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fault":
        return "bg-red-100 text-red-800 border-red-200";
      case "scheduled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "ship_loader":
        return "🏗️";
      case "grab_crane":
        return "🏃";
      case "conveyor":
        return "🔄";
      case "mobile_crane":
        return "🚛";
      default:
        return "⚙️";
    }
  };

  // Chart data
  const equipmentEfficiencyData = equipment.map((eq) => ({
    name: eq.name,
    efficiency: eq.efficiency,
    utilization: (eq.current_load / eq.capacity) * 100,
    target: 85,
  }));

  const energyConsumptionData = equipment.map((eq) => ({
    name: eq.name.split(" ").slice(-1)[0],
    consumption: eq.energy_consumption,
    hours: eq.operating_hours_today,
  }));

  const loadingPerformanceData = schedule.map((sched) => ({
    vessel: sched.vessel_name.split(" ").slice(-1)[0],
    rate: sched.loading_rate,
    efficiency: sched.efficiency,
    target_rate: 2500,
  }));

  const selectedEquipmentData = selectedEquipment
    ? equipment.find((eq) => eq.id === selectedEquipment)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Optimization
          </h2>
          <p className="text-gray-600">
            AI-powered loading efficiency optimization
          </p>
        </div>
        <div className="flex gap-2">
          {["equipment", "schedule", "optimization"].map((mode) => (
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
              <p className="text-sm text-gray-600">Equipment Active</p>
              <p className="text-2xl font-bold text-green-600">
                {equipment.filter((eq) => eq.status === "operational").length}
              </p>
              <p className="text-xs text-gray-500">
                of {equipment.length} total
              </p>
            </div>
            <span className="text-2xl">⚙️</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-blue-600">
                {(
                  equipment.reduce((sum, eq) => sum + eq.efficiency, 0) /
                  equipment.length
                ).toFixed(0)}
                %
              </p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Operations</p>
              <p className="text-2xl font-bold text-yellow-600">
                {schedule.filter((s) => s.status === "active").length}
              </p>
            </div>
            <span className="text-2xl">🚢</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Energy Savings</p>
              <p className="text-2xl font-bold text-red-600">
                {suggestions.filter((s) => s.type === "energy").length}
              </p>
              <p className="text-xs text-gray-500">opportunities</p>
            </div>
            <span className="text-2xl">⚡</span>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === "equipment" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Equipment Status
                </h3>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Optimize All
                </Button>
              </div>

              <div className="space-y-4">
                {equipment.map((eq) => (
                  <div
                    key={eq.id}
                    className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-100 ${
                      selectedEquipment === eq.id
                        ? "ring-2 ring-red-500 bg-red-50"
                        : ""
                    }`}
                    onClick={() => setSelectedEquipment(eq.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {getEquipmentIcon(eq.type)}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {eq.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {eq.location} • {eq.operator}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(eq.status)}>
                        {eq.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="text-sm font-medium">{eq.capacity} TPH</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Load</p>
                        <p className="text-sm font-medium">
                          {eq.current_load.toFixed(0)} TPH
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Efficiency</p>
                        <p className="text-sm font-medium">
                          {eq.efficiency.toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          Utilization
                        </span>
                        <span className="text-xs text-gray-600">
                          {((eq.current_load / eq.capacity) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            eq.status === "operational"
                              ? "bg-green-600"
                              : eq.status === "standby"
                              ? "bg-blue-600"
                              : eq.status === "maintenance"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{
                            width: `${(eq.current_load / eq.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Hours Today:</span>
                        <span className="ml-2">
                          {eq.operating_hours_today}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Energy:</span>
                        <span className="ml-2">
                          {eq.energy_consumption} kWh
                        </span>
                      </div>
                    </div>

                    {eq.status === "maintenance" && (
                      <div className="mt-2 text-sm text-yellow-600">
                        ⚠️ Maintenance due: {eq.maintenance_due}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Equipment Details / Performance Chart */}
          <div className="space-y-6">
            {selectedEquipmentData ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Equipment Details
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEquipment(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedEquipmentData.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 capitalize">
                          {selectedEquipmentData.type.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2">
                          {selectedEquipmentData.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Operator:</span>
                        <span className="ml-2">
                          {selectedEquipmentData.operator}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Maintenance:</span>
                        <span className="ml-2">
                          {selectedEquipmentData.maintenance_due}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Performance Metrics
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Load:</span>
                        <span>
                          {selectedEquipmentData.current_load.toFixed(0)} TPH
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (selectedEquipmentData.current_load /
                                selectedEquipmentData.capacity) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Efficiency:</span>
                        <span>
                          {selectedEquipmentData.efficiency.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${selectedEquipmentData.efficiency}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Operating Hours:</span>
                        <span>
                          {selectedEquipmentData.operating_hours_today}h
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Energy Consumption:</span>
                        <span>
                          {selectedEquipmentData.energy_consumption} kWh
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipment Efficiency
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={equipmentEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="efficiency"
                      fill="#dc2626"
                      name="Efficiency %"
                    />
                    <Line
                      dataKey="target"
                      stroke="#6b7280"
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Energy Consumption */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Energy Consumption
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={energyConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="consumption"
                    stroke="#dc2626"
                    fill="#fef2f2"
                    name="kWh"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {viewMode === "schedule" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Loading Schedule
              </h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Optimize Schedule
              </Button>
            </div>

            <div className="space-y-4">
              {schedule.map((sched) => (
                <div key={sched.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {sched.vessel_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {sched.berth} • {sched.cargo_type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(sched.status)}>
                        {sched.status}
                      </Badge>
                      <Badge variant="outline">
                        {sched.quantity.toLocaleString()} tons
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Schedule</p>
                      <p className="text-sm font-medium">
                        {sched.scheduled_start}
                      </p>
                      <p className="text-xs text-gray-600">
                        to {sched.scheduled_end}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loading Rate</p>
                      <p className="text-sm font-medium">
                        {sched.loading_rate.toFixed(0)} TPH
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Efficiency</p>
                      <p className="text-sm font-medium">
                        {sched.efficiency.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">
                      Equipment Assignment
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sched.equipment_assignment.map((eq, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {eq}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(sched.delays.equipment > 0 ||
                    sched.delays.weather > 0 ||
                    sched.delays.operational > 0) && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Equipment Delay:</span>
                        <span className="ml-2 text-red-600">
                          {sched.delays.equipment}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weather Delay:</span>
                        <span className="ml-2 text-amber-600">
                          {sched.delays.weather}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Operational Delay:
                        </span>
                        <span className="ml-2 text-blue-600">
                          {sched.delays.operational}h
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Loading Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loadingPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vessel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#dc2626"
                  name="Loading Rate (TPH)"
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#3b82f6"
                  name="Efficiency %"
                />
                <Line
                  type="monotone"
                  dataKey="target_rate"
                  stroke="#6b7280"
                  strokeDasharray="5 5"
                  name="Target Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {viewMode === "optimization" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                AI Optimization Suggestions
              </h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Generate New Suggestions
              </Button>
            </div>

            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge
                          className={getPriorityColor(suggestion.priority)}
                        >
                          {suggestion.priority} priority
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {suggestion.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {(suggestion.ai_confidence * 100).toFixed(0)}%
                          confidence
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {suggestion.description}
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        {suggestion.impact}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${(suggestion.savings_estimate / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-gray-500">savings/year</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          Implementation:
                        </span>
                        <Badge
                          variant="outline"
                          className={`ml-2 ${
                            suggestion.implementation_effort === "low"
                              ? "bg-green-50 text-green-700"
                              : suggestion.implementation_effort === "medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {suggestion.implementation_effort}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Implement
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Optimization Impact Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Optimization Impact Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                data={suggestions.map((s) => ({
                  name: s.title.split(" ").slice(0, 2).join(" "),
                  savings: s.savings_estimate / 1000,
                  confidence: s.ai_confidence * 100,
                  effort:
                    s.implementation_effort === "low"
                      ? 1
                      : s.implementation_effort === "medium"
                      ? 2
                      : 3,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="confidence" name="AI Confidence %" />
                <YAxis dataKey="savings" name="Savings ($K)" />
                <Tooltip />
                <Scatter dataKey="savings" fill="#dc2626" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LoadingOptimization;
