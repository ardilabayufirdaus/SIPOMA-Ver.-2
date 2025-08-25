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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DeliveryPlan {
  id: string;
  vessel_name: string;
  customer: string;
  cargo_type: string;
  quantity: number;
  origin: string;
  destination: string;
  planned_loading_date: string;
  estimated_arrival: string;
  priority: "high" | "medium" | "low";
  status: "planning" | "confirmed" | "in_transit" | "delivered" | "delayed";
  berth_assignment?: string;
  weather_impact: number;
  cost_estimate: number;
  route_optimization: {
    distance: number;
    fuel_consumption: number;
    estimated_duration: number;
    alternative_routes: number;
  };
  milestones: {
    loading_complete: boolean;
    departure: boolean;
    transit: boolean;
    arrival: boolean;
    unloading_complete: boolean;
  };
}

interface WeatherCondition {
  date: string;
  wind_speed: number;
  wave_height: number;
  visibility: number;
  precipitation: number;
  risk_level: "low" | "medium" | "high";
  impact_on_operations: string;
}

const DeliveryPlanning = () => {
  const [deliveryPlans, setDeliveryPlans] = useState<DeliveryPlan[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<WeatherCondition[]>(
    []
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "list" | "timeline" | "optimization"
  >("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Simulate real-time data updates
  useEffect(() => {
    const generateDeliveryPlans = (): DeliveryPlan[] => [
      {
        id: "plan-1",
        vessel_name: "MV Semen Nusantara",
        customer: "PT Holcim Indonesia",
        cargo_type: "Cement Bulk",
        quantity: 25000,
        origin: "Gresik Port",
        destination: "Jakarta Port",
        planned_loading_date: "2024-01-15 08:00",
        estimated_arrival: "2024-01-16 14:00",
        priority: "high",
        status: "in_transit",
        berth_assignment: "Berth 1",
        weather_impact: 15,
        cost_estimate: 125000,
        route_optimization: {
          distance: 485,
          fuel_consumption: 12.5,
          estimated_duration: 30,
          alternative_routes: 2,
        },
        milestones: {
          loading_complete: true,
          departure: true,
          transit: true,
          arrival: false,
          unloading_complete: false,
        },
      },
      {
        id: "plan-2",
        vessel_name: "MV Gresik Express",
        customer: "PT Indocement",
        cargo_type: "Cement Bags",
        quantity: 18000,
        origin: "Gresik Port",
        destination: "Surabaya Port",
        planned_loading_date: "2024-01-15 14:00",
        estimated_arrival: "2024-01-15 22:00",
        priority: "medium",
        status: "confirmed",
        berth_assignment: "Berth 2",
        weather_impact: 5,
        cost_estimate: 85000,
        route_optimization: {
          distance: 145,
          fuel_consumption: 4.2,
          estimated_duration: 8,
          alternative_routes: 1,
        },
        milestones: {
          loading_complete: false,
          departure: false,
          transit: false,
          arrival: false,
          unloading_complete: false,
        },
      },
      {
        id: "plan-3",
        vessel_name: "MV Jakarta Pioneer",
        customer: "PT Semen Indonesia",
        cargo_type: "Clinker",
        quantity: 32000,
        origin: "Bangkok Port",
        destination: "Gresik Port",
        planned_loading_date: "2024-01-14 16:00",
        estimated_arrival: "2024-01-15 22:00",
        priority: "high",
        status: "delayed",
        weather_impact: 25,
        cost_estimate: 180000,
        route_optimization: {
          distance: 1250,
          fuel_consumption: 45.8,
          estimated_duration: 72,
          alternative_routes: 3,
        },
        milestones: {
          loading_complete: true,
          departure: true,
          transit: true,
          arrival: false,
          unloading_complete: false,
        },
      },
      {
        id: "plan-4",
        vessel_name: "MV Surabaya Star",
        customer: "PT Lafarge Cement",
        cargo_type: "Cement Bags",
        quantity: 22000,
        origin: "Singapore Port",
        destination: "Semarang Port",
        planned_loading_date: "2024-01-16 08:00",
        estimated_arrival: "2024-01-17 16:00",
        priority: "medium",
        status: "planning",
        weather_impact: 10,
        cost_estimate: 145000,
        route_optimization: {
          distance: 680,
          fuel_consumption: 18.5,
          estimated_duration: 32,
          alternative_routes: 2,
        },
        milestones: {
          loading_complete: false,
          departure: false,
          transit: false,
          arrival: false,
          unloading_complete: false,
        },
      },
      {
        id: "plan-5",
        vessel_name: "MV Ocean Breeze",
        customer: "PT Cemex Indonesia",
        cargo_type: "Cement Bulk",
        quantity: 28000,
        origin: "Manila Port",
        destination: "Gresik Port",
        planned_loading_date: "2024-01-16 14:00",
        estimated_arrival: "2024-01-18 10:00",
        priority: "low",
        status: "planning",
        weather_impact: 20,
        cost_estimate: 165000,
        route_optimization: {
          distance: 925,
          fuel_consumption: 28.2,
          estimated_duration: 42,
          alternative_routes: 4,
        },
        milestones: {
          loading_complete: false,
          departure: false,
          transit: false,
          arrival: false,
          unloading_complete: false,
        },
      },
    ];

    const generateWeatherForecast = (): WeatherCondition[] => [
      {
        date: "2024-01-15",
        wind_speed: 12,
        wave_height: 1.5,
        visibility: 8,
        precipitation: 10,
        risk_level: "low",
        impact_on_operations: "Minimal impact on loading operations",
      },
      {
        date: "2024-01-16",
        wind_speed: 18,
        wave_height: 2.2,
        visibility: 6,
        precipitation: 25,
        risk_level: "medium",
        impact_on_operations: "Possible delays in smaller vessel operations",
      },
      {
        date: "2024-01-17",
        wind_speed: 25,
        wave_height: 3.1,
        visibility: 4,
        precipitation: 45,
        risk_level: "high",
        impact_on_operations: "High risk of operational delays",
      },
      {
        date: "2024-01-18",
        wind_speed: 15,
        wave_height: 1.8,
        visibility: 7,
        precipitation: 15,
        risk_level: "low",
        impact_on_operations: "Weather conditions improving",
      },
      {
        date: "2024-01-19",
        wind_speed: 10,
        wave_height: 1.2,
        visibility: 9,
        precipitation: 5,
        risk_level: "low",
        impact_on_operations: "Optimal conditions for all operations",
      },
    ];

    // Initial data
    setDeliveryPlans(generateDeliveryPlans());
    setWeatherForecast(generateWeatherForecast());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setDeliveryPlans((prev) =>
        prev.map((plan) => {
          const updatedPlan = { ...plan };

          // Update weather impact randomly
          updatedPlan.weather_impact = Math.max(
            0,
            plan.weather_impact + (Math.random() - 0.5) * 5
          );

          // Progress milestones for in-transit deliveries
          if (plan.status === "in_transit") {
            const random = Math.random();
            if (random < 0.1 && !updatedPlan.milestones.arrival) {
              updatedPlan.milestones.arrival = true;
              updatedPlan.status = "delivered";
            }
          }

          return updatedPlan;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter delivery plans
  const filteredPlans = deliveryPlans.filter(
    (plan) => filterStatus === "all" || plan.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
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

  const getWeatherRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chart data
  const deliveryVolumeData = deliveryPlans.map((plan) => ({
    vessel: plan.vessel_name.split(" ").slice(-1)[0],
    quantity: plan.quantity / 1000,
    cost: plan.cost_estimate / 1000,
  }));

  const weatherTrendData = weatherForecast.map((weather) => ({
    date: weather.date.split("-").slice(-1)[0],
    wind: weather.wind_speed,
    waves: weather.wave_height,
    visibility: weather.visibility,
    precipitation: weather.precipitation,
  }));

  const selectedPlanData = selectedPlan
    ? deliveryPlans.find((p) => p.id === selectedPlan)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Planning
          </h2>
          <p className="text-gray-600">
            Optimize shipping schedules and routes
          </p>
        </div>
        <div className="flex gap-2">
          {["list", "timeline", "optimization"].map((mode) => (
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

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          "all",
          "planning",
          "confirmed",
          "in_transit",
          "delivered",
          "delayed",
        ].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={
              filterStatus === status ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {status === "all"
              ? "All"
              : status.charAt(0).toUpperCase() +
                status.slice(1).replace("_", " ")}
            <span className="ml-1 text-xs">
              (
              {status === "all"
                ? deliveryPlans.length
                : deliveryPlans.filter((p) => p.status === status).length}
              )
            </span>
          </Button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryPlans.length}
              </p>
            </div>
            <span className="text-2xl">📦</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-yellow-600">
                {deliveryPlans.filter((p) => p.status === "in_transit").length}
              </p>
            </div>
            <span className="text-2xl">🚢</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-blue-600">
                {(
                  deliveryPlans.reduce((sum, p) => sum + p.quantity, 0) / 1000
                ).toFixed(0)}
                K
              </p>
              <p className="text-xs text-gray-500">tons</p>
            </div>
            <span className="text-2xl">⚖️</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weather Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {weatherForecast.filter((w) => w.risk_level === "high").length}
              </p>
              <p className="text-xs text-gray-500">high risk days</p>
            </div>
            <span className="text-2xl">🌊</span>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Plans List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Plans
                </h3>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  + Create Plan
                </Button>
              </div>

              <div className="space-y-4">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-100 ${
                      selectedPlan === plan.id
                        ? "ring-2 ring-red-500 bg-red-50"
                        : ""
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {plan.vessel_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {plan.customer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(plan.priority)}>
                          {plan.priority}
                        </Badge>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Cargo</p>
                        <p className="text-sm font-medium">{plan.cargo_type}</p>
                        <p className="text-xs text-gray-600">
                          {plan.quantity.toLocaleString()} tons
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Route</p>
                        <p className="text-sm font-medium">{plan.origin}</p>
                        <p className="text-xs text-gray-600">
                          → {plan.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Schedule</p>
                        <p className="text-sm font-medium">
                          {plan.planned_loading_date}
                        </p>
                        <p className="text-xs text-gray-600">
                          ETA: {plan.estimated_arrival}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Distance:</span>
                        <span className="ml-2 font-medium">
                          {plan.route_optimization.distance} nm
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 font-medium">
                          {plan.route_optimization.estimated_duration}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>
                        <span className="ml-2 font-medium">
                          ${(plan.cost_estimate / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>

                    {plan.weather_impact > 0 && (
                      <div className="mt-2 flex items-center text-sm text-amber-600">
                        <span className="mr-1">🌊</span>
                        {plan.weather_impact.toFixed(0)}% weather impact
                      </div>
                    )}

                    {/* Progress Bar for Milestones */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-600">
                          {
                            Object.values(plan.milestones).filter(Boolean)
                              .length
                          }
                          /5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (Object.values(plan.milestones).filter(Boolean)
                                .length /
                                5) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Plan Details / Weather Forecast */}
          <div className="space-y-6">
            {selectedPlanData ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plan Details
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPlan(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedPlanData.vessel_name}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2">
                          {selectedPlanData.customer}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Berth:</span>
                        <span className="ml-2">
                          {selectedPlanData.berth_assignment || "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Route Optimization
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>
                          {selectedPlanData.route_optimization.distance} nm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel:</span>
                        <span>
                          {selectedPlanData.route_optimization.fuel_consumption}{" "}
                          tons
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>
                          {
                            selectedPlanData.route_optimization
                              .estimated_duration
                          }
                          h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alt. Routes:</span>
                        <span>
                          {
                            selectedPlanData.route_optimization
                              .alternative_routes
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Milestones
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(selectedPlanData.milestones).map(
                        ([milestone, completed]) => (
                          <div
                            key={milestone}
                            className="flex items-center text-sm"
                          >
                            <span
                              className={
                                completed ? "text-green-600" : "text-gray-400"
                              }
                            >
                              {completed ? "✓" : "○"}
                            </span>
                            <span className="ml-2 capitalize">
                              {milestone.replace("_", " ")}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Volume
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={deliveryVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vessel" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="quantity"
                      fill="#dc2626"
                      name="Quantity (K tons)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Weather Forecast */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Weather Forecast
              </h3>
              <div className="space-y-3">
                {weatherForecast.map((weather) => (
                  <div key={weather.date} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{weather.date}</span>
                      <Badge
                        className={getWeatherRiskColor(weather.risk_level)}
                      >
                        {weather.risk_level} risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <div>Wind: {weather.wind_speed} kt</div>
                      <div>Waves: {weather.wave_height} m</div>
                      <div>Visibility: {weather.visibility} km</div>
                      <div>Rain: {weather.precipitation}%</div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {weather.impact_on_operations}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {viewMode === "timeline" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Delivery Timeline
          </h3>
          <div className="space-y-4">
            {deliveryPlans.map((plan, index) => (
              <div key={plan.id} className="relative">
                {index < deliveryPlans.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
                )}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      plan.status === "delivered"
                        ? "bg-green-600"
                        : plan.status === "in_transit"
                        ? "bg-yellow-600"
                        : plan.status === "delayed"
                        ? "bg-red-600"
                        : "bg-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {plan.vessel_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {plan.origin} → {plan.destination}
                        </p>
                        <p className="text-sm text-gray-600">
                          {plan.cargo_type} • {plan.quantity.toLocaleString()}{" "}
                          tons
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          ETA: {plan.estimated_arrival}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {viewMode === "optimization" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Weather Impact Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weatherTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="wind"
                  stroke="#dc2626"
                  name="Wind (kt)"
                />
                <Line
                  type="monotone"
                  dataKey="waves"
                  stroke="#3b82f6"
                  name="Waves (m)"
                />
                <Line
                  type="monotone"
                  dataKey="precipitation"
                  stroke="#6b7280"
                  name="Rain (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cost vs Volume Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={deliveryVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vessel" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stackId="1"
                  stroke="#dc2626"
                  fill="#fef2f2"
                  name="Cost ($K)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeliveryPlanning;
