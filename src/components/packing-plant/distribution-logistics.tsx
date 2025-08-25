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

interface DeliveryOrder {
  id: string;
  customer_name: string;
  destination: string;
  product_type: string;
  quantity: number;
  unit: string;
  order_date: string;
  planned_delivery: string;
  status: "pending" | "loading" | "in_transit" | "delivered" | "delayed";
  truck_id: string;
  driver_name: string;
  distance_km: number;
  estimated_duration: string;
  delivery_cost: number;
  priority: "low" | "normal" | "high" | "urgent";
}

interface LogisticsMetrics {
  total_deliveries_today: number;
  on_time_delivery_rate: number;
  average_delivery_time: number;
  fuel_efficiency: number;
  truck_utilization: number;
  delivery_cost_per_ton: number;
  customer_satisfaction: number;
  total_distance_covered: number;
}

interface RouteOptimization {
  route_id: string;
  truck_id: string;
  total_distance: number;
  estimated_time: string;
  fuel_consumption: number;
  total_deliveries: number;
  optimization_savings: number;
  efficiency_score: number;
  stops: Array<{
    order_id: string;
    customer: string;
    location: string;
    estimated_arrival: string;
    delivery_duration: string;
  }>;
}

interface TruckStatus {
  truck_id: string;
  driver_name: string;
  status: "available" | "loading" | "in_transit" | "maintenance" | "offline";
  current_location: string;
  cargo_weight: number;
  capacity_utilization: number;
  fuel_level: number;
  last_maintenance: string;
  next_service: string;
  total_km_today: number;
}

const DistributionLogistics = () => {
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [logisticsMetrics, setLogisticsMetrics] = useState<LogisticsMetrics>({
    total_deliveries_today: 0,
    on_time_delivery_rate: 0,
    average_delivery_time: 0,
    fuel_efficiency: 0,
    truck_utilization: 0,
    delivery_cost_per_ton: 0,
    customer_satisfaction: 0,
    total_distance_covered: 0,
  });
  const [routeOptimizations, setRouteOptimizations] = useState<
    RouteOptimization[]
  >([]);
  const [truckStatus, setTruckStatus] = useState<TruckStatus[]>([]);
  const [selectedView, setSelectedView] = useState<
    "orders" | "routes" | "trucks" | "analytics"
  >("orders");

  // Simulate real-time logistics data
  useEffect(() => {
    const generateDeliveryOrders = (): DeliveryOrder[] => {
      const customers = [
        "PT Wijaya Karya",
        "PT Adhi Karya",
        "PT Waskita Karya",
        "PT PP (Persero)",
        "PT Hutama Karya",
        "PT Brantas Abipraya",
        "PT Nindya Karya",
        "PT Istaka Karya",
      ];

      const destinations = [
        "Jakarta Utara",
        "Tangerang",
        "Bekasi",
        "Depok",
        "Bogor",
        "Karawang",
        "Purwakarta",
        "Bandung",
        "Cirebon",
        "Semarang",
      ];

      const products = [
        "OPC 50kg",
        "OPC 40kg",
        "PPC 50kg",
        "PPC 40kg",
        "PSC 50kg",
      ];
      const statuses: DeliveryOrder["status"][] = [
        "pending",
        "loading",
        "in_transit",
        "delivered",
        "delayed",
      ];
      const priorities: DeliveryOrder["priority"][] = [
        "low",
        "normal",
        "high",
        "urgent",
      ];

      return Array.from({ length: 25 }, (_, i) => {
        const orderDate = new Date();
        orderDate.setHours(
          orderDate.getHours() - Math.floor(Math.random() * 48)
        );

        const plannedDelivery = new Date(orderDate);
        plannedDelivery.setHours(
          plannedDelivery.getHours() + 24 + Math.floor(Math.random() * 72)
        );

        return {
          id: `DO-${String(i + 1).padStart(4, "0")}`,
          customer_name:
            customers[Math.floor(Math.random() * customers.length)],
          destination:
            destinations[Math.floor(Math.random() * destinations.length)],
          product_type: products[Math.floor(Math.random() * products.length)],
          quantity: 20 + Math.floor(Math.random() * 60),
          unit: "tons",
          order_date: orderDate.toISOString().slice(0, 16),
          planned_delivery: plannedDelivery.toISOString().slice(0, 16),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          truck_id: `TR-${String(Math.floor(Math.random() * 12) + 1).padStart(
            3,
            "0"
          )}`,
          driver_name: [
            "Budi Santoso",
            "Ahmad Rahman",
            "Siti Nurhaliza",
            "Joko Widodo",
            "Andi Surya",
            "Made Wirawan",
            "Bayu Pratama",
            "Rizki Ramadan",
          ][Math.floor(Math.random() * 8)],
          distance_km: 50 + Math.floor(Math.random() * 300),
          estimated_duration: `${
            2 + Math.floor(Math.random() * 6)
          }h ${Math.floor(Math.random() * 60)}m`,
          delivery_cost: 150000 + Math.random() * 200000,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
        };
      });
    };

    const generateLogisticsMetrics = (
      orders: DeliveryOrder[]
    ): LogisticsMetrics => {
      const deliveredToday = orders.filter(
        (o) =>
          o.status === "delivered" &&
          new Date(o.planned_delivery).toDateString() ===
            new Date().toDateString()
      ).length;

      const onTimeDeliveries =
        orders.filter((o) => o.status === "delivered").length * 0.85 +
        Math.random() * 0.1;
      const totalDeliveries =
        orders.filter((o) => o.status === "delivered").length || 1;

      return {
        total_deliveries_today: deliveredToday + Math.floor(Math.random() * 8),
        on_time_delivery_rate:
          (onTimeDeliveries / totalDeliveries) * 100 || 88 + Math.random() * 8,
        average_delivery_time: 4.2 + Math.random() * 2,
        fuel_efficiency: 8.5 + Math.random() * 1.5,
        truck_utilization: 75 + Math.random() * 15,
        delivery_cost_per_ton: 45000 + Math.random() * 10000,
        customer_satisfaction: 4.3 + Math.random() * 0.5,
        total_distance_covered: 2500 + Math.random() * 800,
      };
    };

    const generateRouteOptimizations = (): RouteOptimization[] => {
      return Array.from({ length: 8 }, (_, i) => ({
        route_id: `RT-${String(i + 1).padStart(3, "0")}`,
        truck_id: `TR-${String(i + 1).padStart(3, "0")}`,
        total_distance: 150 + Math.random() * 200,
        estimated_time: `${5 + Math.floor(Math.random() * 4)}h ${Math.floor(
          Math.random() * 60
        )}m`,
        fuel_consumption: 35 + Math.random() * 20,
        total_deliveries: 3 + Math.floor(Math.random() * 4),
        optimization_savings: 15 + Math.random() * 25,
        efficiency_score: 80 + Math.random() * 15,
        stops: Array.from(
          { length: 3 + Math.floor(Math.random() * 4) },
          (_, j) => ({
            order_id: `DO-${String(j + 1 + i * 4).padStart(4, "0")}`,
            customer: `Customer ${j + 1}`,
            location: ["Jakarta", "Tangerang", "Bekasi", "Depok", "Bogor"][
              j % 5
            ],
            estimated_arrival: new Date(
              Date.now() + (j + 1) * 2 * 60 * 60 * 1000
            )
              .toISOString()
              .slice(11, 16),
            delivery_duration: `${30 + Math.floor(Math.random() * 30)}m`,
          })
        ),
      }));
    };

    const generateTruckStatus = (): TruckStatus[] => {
      const statuses: TruckStatus["status"][] = [
        "available",
        "loading",
        "in_transit",
        "maintenance",
        "offline",
      ];
      const drivers = [
        "Budi Santoso",
        "Ahmad Rahman",
        "Siti Nurhaliza",
        "Joko Widodo",
        "Andi Surya",
        "Made Wirawan",
        "Bayu Pratama",
        "Rizki Ramadan",
        "Dewi Sartika",
        "Hendra Wijaya",
        "Yudi Pratama",
        "Agus Setiawan",
      ];

      return Array.from({ length: 12 }, (_, i) => ({
        truck_id: `TR-${String(i + 1).padStart(3, "0")}`,
        driver_name: drivers[i],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        current_location: [
          "Jakarta",
          "Tangerang",
          "Bekasi",
          "Bandung",
          "Cirebon",
        ][Math.floor(Math.random() * 5)],
        cargo_weight: Math.random() * 25,
        capacity_utilization: Math.random() * 100,
        fuel_level: 20 + Math.random() * 80,
        last_maintenance: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .slice(0, 10),
        next_service: new Date(
          Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .slice(0, 10),
        total_km_today: Math.random() * 400,
      }));
    };

    // Initial data
    const orders = generateDeliveryOrders();
    setDeliveryOrders(orders);
    setLogisticsMetrics(generateLogisticsMetrics(orders));
    setRouteOptimizations(generateRouteOptimizations());
    setTruckStatus(generateTruckStatus());

    // Update every 45 seconds
    const interval = setInterval(() => {
      const updatedOrders = generateDeliveryOrders();
      setDeliveryOrders(updatedOrders);
      setLogisticsMetrics(generateLogisticsMetrics(updatedOrders));
      setRouteOptimizations(generateRouteOptimizations());
      setTruckStatus(generateTruckStatus());
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "loading":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "loading":
        return "📦";
      case "in_transit":
        return "🚛";
      case "delivered":
        return "✅";
      case "delayed":
        return "⚠️";
      case "available":
        return "🟢";
      case "maintenance":
        return "🔧";
      case "offline":
        return "🔴";
      default:
        return "📋";
    }
  };

  // Chart data
  const deliveryStatusData = [
    {
      name: "Delivered",
      value: deliveryOrders.filter((o) => o.status === "delivered").length,
      color: "#10b981",
    },
    {
      name: "In Transit",
      value: deliveryOrders.filter((o) => o.status === "in_transit").length,
      color: "#f59e0b",
    },
    {
      name: "Loading",
      value: deliveryOrders.filter((o) => o.status === "loading").length,
      color: "#3b82f6",
    },
    {
      name: "Pending",
      value: deliveryOrders.filter((o) => o.status === "pending").length,
      color: "#6b7280",
    },
    {
      name: "Delayed",
      value: deliveryOrders.filter((o) => o.status === "delayed").length,
      color: "#ef4444",
    },
  ];

  const performanceData = [
    {
      metric: "On-Time Delivery",
      value: logisticsMetrics.on_time_delivery_rate,
      target: 95,
      color: "#10b981",
    },
    {
      metric: "Truck Utilization",
      value: logisticsMetrics.truck_utilization,
      target: 85,
      color: "#3b82f6",
    },
    {
      metric: "Fuel Efficiency",
      value: logisticsMetrics.fuel_efficiency,
      target: 10,
      color: "#f59e0b",
    },
    {
      metric: "Customer Satisfaction",
      value: logisticsMetrics.customer_satisfaction * 20,
      target: 90,
      color: "#8b5cf6",
    },
  ];

  const routeEfficiencyData = routeOptimizations.map((route) => ({
    route: route.route_id,
    efficiency: route.efficiency_score,
    savings: route.optimization_savings,
    deliveries: route.total_deliveries,
  }));

  return (
    <div className="space-y-6">
      {/* Header and Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Distribution Logistics
          </h2>
          <p className="text-gray-600">
            AI-powered delivery optimization and fleet management
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { id: "orders", label: "Orders", icon: "📋" },
            { id: "routes", label: "Routes", icon: "🗺️" },
            { id: "trucks", label: "Fleet", icon: "🚛" },
            { id: "analytics", label: "Analytics", icon: "📊" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedView === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView(tab.id as any)}
              className={
                selectedView === tab.id ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deliveries Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {logisticsMetrics.total_deliveries_today}
              </p>
            </div>
            <div className="text-3xl">🚛</div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              📈 +15.2% vs yesterday
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On-Time Delivery</p>
              <p className="text-2xl font-bold text-green-600">
                {logisticsMetrics.on_time_delivery_rate.toFixed(1)}%
              </p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${logisticsMetrics.on_time_delivery_rate}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Delivery Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {logisticsMetrics.average_delivery_time.toFixed(1)}h
              </p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              📉 -0.8h improvement
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fleet Utilization</p>
              <p className="text-2xl font-bold text-purple-600">
                {logisticsMetrics.truck_utilization.toFixed(0)}%
              </p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              📊 Target: 85%
            </Badge>
          </div>
        </Card>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === "orders" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Orders
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {deliveryOrders.slice(0, 15).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">
                          {getStatusIcon(order.status)}
                        </span>
                        <span className="font-medium text-gray-900">
                          {order.id}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>Customer: {order.customer_name}</div>
                        <div>Destination: {order.destination}</div>
                        <div>Product: {order.product_type}</div>
                        <div>
                          Quantity: {order.quantity} {order.unit}
                        </div>
                        <div>Truck: {order.truck_id}</div>
                        <div>Driver: {order.driver_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-medium">{order.distance_km} km</p>
                      <p className="text-xs text-gray-500">
                        {order.estimated_duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deliveryStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {deliveryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {selectedView === "routes" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🤖 AI Route Optimization
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {routeOptimizations.slice(0, 6).map((route) => (
                <Card
                  key={route.route_id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {route.route_id}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Truck: {route.truck_id}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {route.optimization_savings.toFixed(1)}% savings
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <p className="font-medium">
                        {route.total_distance.toFixed(0)} km
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{route.estimated_time}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Deliveries:</span>
                      <p className="font-medium">{route.total_deliveries}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Efficiency:</span>
                      <p className="font-medium">
                        {route.efficiency_score.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">
                      Route Stops:
                    </h5>
                    {route.stops.slice(0, 3).map((stop, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-gray-600">{stop.location}</span>
                        <span className="text-gray-900">
                          {stop.estimated_arrival}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Route Efficiency Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="efficiency"
                  fill="#dc2626"
                  name="Efficiency Score"
                />
                <Bar dataKey="savings" fill="#10b981" name="Savings %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {selectedView === "trucks" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Fleet Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {truckStatus.map((truck) => (
              <Card
                key={truck.truck_id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {truck.truck_id}
                    </h4>
                    <p className="text-sm text-gray-600">{truck.driver_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getStatusIcon(truck.status)}
                    </span>
                    <Badge className={getStatusColor(truck.status)}>
                      {truck.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      {truck.current_location}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">
                      {truck.capacity_utilization.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${truck.capacity_utilization}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Level:</span>
                    <span
                      className={`font-medium ${
                        truck.fuel_level < 30
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {truck.fuel_level.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        truck.fuel_level < 30 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${truck.fuel_level}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Today's Distance:</span>
                    <span className="font-medium">
                      {truck.total_km_today.toFixed(0)} km
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Service:</span>
                    <span className="font-medium text-blue-600">
                      {truck.next_service}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {selectedView === "analytics" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#dc2626" name="Current" />
                <Bar dataKey="target" fill="#10b981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Cost Analysis</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Cost per Ton:</span>
                  <span className="font-bold text-2xl text-red-600">
                    Rp{" "}
                    {(logisticsMetrics.delivery_cost_per_ton / 1000).toFixed(0)}
                    K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fuel Efficiency:</span>
                  <span className="font-bold text-xl text-green-600">
                    {logisticsMetrics.fuel_efficiency.toFixed(1)} km/L
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Distance Today:</span>
                  <span className="font-bold text-xl text-blue-600">
                    {logisticsMetrics.total_distance_covered.toFixed(0)} km
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Customer Satisfaction
              </h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {logisticsMetrics.customer_satisfaction.toFixed(1)}/5.0
                </div>
                <div className="flex justify-center mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < Math.floor(logisticsMetrics.customer_satisfaction)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  📈 +0.3 vs last month
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🤖 AI Logistics Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🚛 Route Optimization
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                AI-optimized routes are saving 18.5% in fuel costs and reducing
                delivery time by 23 minutes on average.
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                View Optimizations
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                ⚠️ Maintenance Alert
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                3 trucks require service within next 5 days. Schedule
                maintenance to avoid delivery disruptions.
              </p>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Schedule Service
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                📊 Demand Prediction
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Jakarta region shows 25% increase in demand next week. Consider
                increasing fleet allocation.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Adjust Fleet
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                ⚡ Efficiency Opportunity
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Load consolidation could reduce trips by 12% and save Rp 2.5M
                monthly in operational costs.
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Implement Strategy
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DistributionLogistics;
