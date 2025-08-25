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

interface WarehouseZone {
  zone_id: string;
  zone_name: string;
  capacity: number;
  current_stock: number;
  utilization_rate: number;
  product_types: string[];
  temperature: number;
  humidity: number;
  status: "optimal" | "warning" | "critical";
  last_inventory: string;
  access_level: "public" | "restricted" | "secure";
}

interface InventoryMovement {
  movement_id: string;
  timestamp: string;
  product_type: string;
  quantity: number;
  movement_type: "in" | "out" | "transfer";
  from_zone: string;
  to_zone: string;
  operator: string;
  reason: string;
  batch_number: string;
}

interface StorageOptimization {
  zone_id: string;
  current_layout: string;
  optimized_layout: string;
  space_savings: number;
  access_improvement: number;
  cost_reduction: number;
  implementation_effort: "low" | "medium" | "high";
  roi_months: number;
}

interface QualityCheck {
  check_id: string;
  timestamp: string;
  zone_id: string;
  product_type: string;
  batch_number: string;
  moisture_content: number;
  temperature_check: number;
  visual_inspection: "pass" | "fail" | "warning";
  contamination_risk: "low" | "medium" | "high";
  inspector: string;
  notes: string;
  corrective_action: string;
}

const WarehouseManagement = () => {
  const [warehouseZones, setWarehouseZones] = useState<WarehouseZone[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<
    InventoryMovement[]
  >([]);
  const [storageOptimizations, setStorageOptimizations] = useState<
    StorageOptimization[]
  >([]);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [selectedView, setSelectedView] = useState<
    "overview" | "movements" | "optimization" | "quality"
  >("overview");
  const [selectedZone, setSelectedZone] = useState<string>("all");

  // Simulate real-time warehouse data
  useEffect(() => {
    const generateWarehouseZones = (): WarehouseZone[] => [
      {
        zone_id: "WH-A01",
        zone_name: "OPC Storage Zone A",
        capacity: 5000,
        current_stock: 4200 + Math.random() * 600,
        utilization_rate: 84 + Math.random() * 12,
        product_types: ["OPC 50kg", "OPC 40kg"],
        temperature: 28 + Math.random() * 4,
        humidity: 45 + Math.random() * 10,
        status: "optimal",
        last_inventory: "2024-01-14 08:30",
        access_level: "public",
      },
      {
        zone_id: "WH-A02",
        zone_name: "OPC Storage Zone B",
        capacity: 5000,
        current_stock: 3800 + Math.random() * 700,
        utilization_rate: 76 + Math.random() * 14,
        product_types: ["OPC 50kg", "OPC 25kg"],
        temperature: 29 + Math.random() * 3,
        humidity: 48 + Math.random() * 8,
        status: "optimal",
        last_inventory: "2024-01-14 09:15",
        access_level: "public",
      },
      {
        zone_id: "WH-B01",
        zone_name: "PPC Storage Zone A",
        capacity: 4000,
        current_stock: 3600 + Math.random() * 300,
        utilization_rate: 90 + Math.random() * 8,
        product_types: ["PPC 50kg", "PPC 40kg"],
        temperature: 27 + Math.random() * 5,
        humidity: 42 + Math.random() * 12,
        status: "warning",
        last_inventory: "2024-01-14 07:45",
        access_level: "public",
      },
      {
        zone_id: "WH-B02",
        zone_name: "PPC Storage Zone B",
        capacity: 4000,
        current_stock: 2100 + Math.random() * 400,
        utilization_rate: 52.5 + Math.random() * 10,
        product_types: ["PPC 40kg", "PPC 25kg"],
        temperature: 30 + Math.random() * 4,
        humidity: 50 + Math.random() * 8,
        status: "optimal",
        last_inventory: "2024-01-14 10:20",
        access_level: "public",
      },
      {
        zone_id: "WH-C01",
        zone_name: "PSC Storage Zone",
        capacity: 3000,
        current_stock: 2850 + Math.random() * 100,
        utilization_rate: 95 + Math.random() * 4,
        product_types: ["PSC 50kg", "PSC 40kg"],
        temperature: 26 + Math.random() * 6,
        humidity: 40 + Math.random() * 15,
        status: "critical",
        last_inventory: "2024-01-14 06:30",
        access_level: "restricted",
      },
      {
        zone_id: "WH-D01",
        zone_name: "Special Products Zone",
        capacity: 2000,
        current_stock: 850 + Math.random() * 200,
        utilization_rate: 42.5 + Math.random() * 10,
        product_types: ["Special Blend", "Premium OPC"],
        temperature: 25 + Math.random() * 3,
        humidity: 38 + Math.random() * 7,
        status: "optimal",
        last_inventory: "2024-01-14 11:00",
        access_level: "secure",
      },
    ];

    const generateInventoryMovements = (): InventoryMovement[] => {
      const movements = [];
      const products = [
        "OPC 50kg",
        "OPC 40kg",
        "PPC 50kg",
        "PPC 40kg",
        "PSC 50kg",
      ];
      const zones = [
        "WH-A01",
        "WH-A02",
        "WH-B01",
        "WH-B02",
        "WH-C01",
        "WH-D01",
        "Production",
        "Loading Bay",
      ];
      const operators = [
        "Ahmad Yusuf",
        "Budi Santoso",
        "Citra Dewi",
        "Doni Pratama",
        "Eka Sari",
      ];
      const movementTypes: InventoryMovement["movement_type"][] = [
        "in",
        "out",
        "transfer",
      ];
      const reasons = [
        "Production input",
        "Customer delivery",
        "Quality inspection",
        "Zone rebalancing",
        "Maintenance relocation",
        "Emergency dispatch",
        "Inventory audit",
        "Safety check",
      ];

      for (let i = 0; i < 25; i++) {
        const timestamp = new Date();
        timestamp.setMinutes(
          timestamp.getMinutes() - Math.floor(Math.random() * 720)
        ); // Last 12 hours

        movements.push({
          movement_id: `MV-${String(i + 1).padStart(4, "0")}`,
          timestamp: timestamp.toISOString(),
          product_type: products[Math.floor(Math.random() * products.length)],
          quantity: 10 + Math.floor(Math.random() * 90),
          movement_type:
            movementTypes[Math.floor(Math.random() * movementTypes.length)],
          from_zone: zones[Math.floor(Math.random() * zones.length)],
          to_zone: zones[Math.floor(Math.random() * zones.length)],
          operator: operators[Math.floor(Math.random() * operators.length)],
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          batch_number: `BATCH-${String(Date.now()).slice(-6)}`,
        });
      }

      return movements.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    };

    const generateStorageOptimizations = (): StorageOptimization[] => [
      {
        zone_id: "WH-A01",
        current_layout: "Traditional stacking",
        optimized_layout: "High-density racking",
        space_savings: 18.5,
        access_improvement: 12.3,
        cost_reduction: 25000,
        implementation_effort: "medium",
        roi_months: 8,
      },
      {
        zone_id: "WH-B01",
        current_layout: "Random storage",
        optimized_layout: "ABC classification layout",
        space_savings: 22.1,
        access_improvement: 35.7,
        cost_reduction: 18000,
        implementation_effort: "low",
        roi_months: 6,
      },
      {
        zone_id: "WH-C01",
        current_layout: "Single-deep storage",
        optimized_layout: "Double-deep storage",
        space_savings: 15.8,
        access_improvement: 8.2,
        cost_reduction: 32000,
        implementation_effort: "high",
        roi_months: 12,
      },
      {
        zone_id: "WH-D01",
        current_layout: "Floor stacking",
        optimized_layout: "Automated retrieval",
        space_savings: 45.2,
        access_improvement: 68.9,
        cost_reduction: 85000,
        implementation_effort: "high",
        roi_months: 18,
      },
    ];

    const generateQualityChecks = (): QualityCheck[] => {
      const zones = [
        "WH-A01",
        "WH-A02",
        "WH-B01",
        "WH-B02",
        "WH-C01",
        "WH-D01",
      ];
      const products = [
        "OPC 50kg",
        "OPC 40kg",
        "PPC 50kg",
        "PPC 40kg",
        "PSC 50kg",
      ];
      const inspectors = [
        "Dr. Ahmad Suparman",
        "Ir. Siti Nurhaliza",
        "Drs. Budi Hartono",
      ];
      const visualResults: QualityCheck["visual_inspection"][] = [
        "pass",
        "pass",
        "pass",
        "warning",
        "fail",
      ];
      const contamination: QualityCheck["contamination_risk"][] = [
        "low",
        "low",
        "medium",
        "high",
      ];

      return Array.from({ length: 15 }, (_, i) => {
        const timestamp = new Date();
        timestamp.setHours(
          timestamp.getHours() - Math.floor(Math.random() * 48)
        );

        return {
          check_id: `QC-${String(i + 1).padStart(4, "0")}`,
          timestamp: timestamp.toISOString(),
          zone_id: zones[Math.floor(Math.random() * zones.length)],
          product_type: products[Math.floor(Math.random() * products.length)],
          batch_number: `BATCH-${String(Date.now() + i).slice(-6)}`,
          moisture_content: 0.5 + Math.random() * 2,
          temperature_check: 25 + Math.random() * 8,
          visual_inspection:
            visualResults[Math.floor(Math.random() * visualResults.length)],
          contamination_risk:
            contamination[Math.floor(Math.random() * contamination.length)],
          inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
          notes: [
            "Normal condition, all parameters within spec",
            "Slight moisture detected, monitoring required",
            "Temperature variance noted, check ventilation",
            "Visual inspection shows minor dust accumulation",
            "Excellent quality, meets all standards",
          ][Math.floor(Math.random() * 5)],
          corrective_action:
            Math.random() > 0.7
              ? "Ventilation adjustment required"
              : "No action needed",
        };
      });
    };

    // Initial data
    setWarehouseZones(generateWarehouseZones());
    setInventoryMovements(generateInventoryMovements());
    setStorageOptimizations(generateStorageOptimizations());
    setQualityChecks(generateQualityChecks());

    // Update every 90 seconds
    const interval = setInterval(() => {
      setWarehouseZones(generateWarehouseZones());
      setInventoryMovements(generateInventoryMovements());
    }, 90000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessColor = (level: string) => {
    switch (level) {
      case "public":
        return "bg-blue-100 text-blue-800";
      case "restricted":
        return "bg-orange-100 text-orange-800";
      case "secure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case "in":
        return "bg-green-100 text-green-800";
      case "out":
        return "bg-red-100 text-red-800";
      case "transfer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "in":
        return "📥";
      case "out":
        return "📤";
      case "transfer":
        return "🔄";
      default:
        return "📦";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
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

  const getQualityColor = (inspection: string) => {
    switch (inspection) {
      case "pass":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "fail":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter data
  const filteredZones =
    selectedZone === "all"
      ? warehouseZones
      : warehouseZones.filter((z) => z.zone_id === selectedZone);

  // Chart data
  const utilizationData = warehouseZones.map((zone) => ({
    zone: zone.zone_name.replace(" Zone", ""),
    utilization: zone.utilization_rate,
    capacity: zone.capacity,
    current: zone.current_stock,
  }));

  const movementTrendData = inventoryMovements
    .slice(0, 12)
    .reverse()
    .map((movement, index) => ({
      time: new Date(movement.timestamp).toLocaleTimeString().slice(0, 5),
      in: inventoryMovements
        .slice(index, index + 3)
        .filter((m) => m.movement_type === "in").length,
      out: inventoryMovements
        .slice(index, index + 3)
        .filter((m) => m.movement_type === "out").length,
      transfer: inventoryMovements
        .slice(index, index + 3)
        .filter((m) => m.movement_type === "transfer").length,
    }));

  const productDistributionData = warehouseZones
    .flatMap((zone) =>
      zone.product_types.map((product) => ({
        name: product,
        value: Math.floor(zone.current_stock / zone.product_types.length),
        zone: zone.zone_name,
      }))
    )
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.name);
      if (existing) {
        existing.value += curr.value;
      } else {
        acc.push({ name: curr.name, value: curr.value });
      }
      return acc;
    }, [] as Array<{ name: string; value: number }>);

  const totalCapacity = warehouseZones.reduce(
    (sum, zone) => sum + zone.capacity,
    0
  );
  const totalStock = warehouseZones.reduce(
    (sum, zone) => sum + zone.current_stock,
    0
  );
  const averageUtilization =
    warehouseZones.reduce((sum, zone) => sum + zone.utilization_rate, 0) /
    warehouseZones.length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Warehouse Management
          </h2>
          <p className="text-gray-600">
            Smart storage optimization and inventory control
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Zones</option>
            {warehouseZones.map((zone) => (
              <option key={zone.zone_id} value={zone.zone_id}>
                {zone.zone_name}
              </option>
            ))}
          </select>
          {[
            { id: "overview", label: "Overview", icon: "🏪" },
            { id: "movements", label: "Movements", icon: "📦" },
            { id: "optimization", label: "Optimization", icon: "🚀" },
            { id: "quality", label: "Quality", icon: "✅" },
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCapacity.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">tons</p>
            </div>
            <div className="text-3xl">🏪</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(totalStock).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">tons stored</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(totalStock / totalCapacity) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-green-600">
                {averageUtilization.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">space efficiency</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              📈 Target: 85%
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Zones</p>
              <p className="text-2xl font-bold text-purple-600">
                {warehouseZones.filter((z) => z.status === "optimal").length}/
                {warehouseZones.length}
              </p>
              <p className="text-xs text-gray-500">optimal status</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </Card>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === "overview" && (
        <div className="space-y-6">
          {/* Zone Status Cards */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Storage Zone Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredZones.map((zone) => (
                <Card
                  key={zone.zone_id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {zone.zone_name}
                      </h4>
                      <p className="text-sm text-gray-600">{zone.zone_id}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(zone.status)}>
                        {zone.status}
                      </Badge>
                      <Badge className={getAccessColor(zone.access_level)}>
                        {zone.access_level}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization</span>
                        <span>{zone.utilization_rate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            zone.utilization_rate > 90
                              ? "bg-red-500"
                              : zone.utilization_rate > 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${zone.utilization_rate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Current:</span>
                        <p className="font-medium">
                          {Math.round(zone.current_stock)} tons
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <p className="font-medium">{zone.capacity} tons</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <p className="font-medium">
                          {zone.temperature.toFixed(1)}°C
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Humidity:</span>
                        <p className="font-medium">
                          {zone.humidity.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Products:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {zone.product_types.map((product, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      Last inventory: {zone.last_inventory}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zone Utilization
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="zone"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="utilization"
                    fill="#dc2626"
                    name="Utilization %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}t`}
                  >
                    {productDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${index * 45}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {selectedView === "movements" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Inventory Movements
              </h3>
              <Button className="bg-red-600 hover:bg-red-700">
                📝 New Movement
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inventoryMovements.slice(0, 15).map((movement) => (
                <div
                  key={movement.movement_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">
                        {getMovementIcon(movement.movement_type)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {movement.movement_id}
                      </span>
                      <Badge
                        className={getMovementColor(movement.movement_type)}
                      >
                        {movement.movement_type}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(movement.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>Product: {movement.product_type}</div>
                      <div>Quantity: {movement.quantity} tons</div>
                      <div>From: {movement.from_zone}</div>
                      <div>To: {movement.to_zone}</div>
                      <div>Operator: {movement.operator}</div>
                      <div>Batch: {movement.batch_number}</div>
                      <div className="col-span-2">
                        Reason: {movement.reason}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Movement Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={movementTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="in"
                  stackId="1"
                  stroke="#10b981"
                  fill="#d1fae5"
                  name="Incoming"
                />
                <Area
                  type="monotone"
                  dataKey="out"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#fee2e2"
                  name="Outgoing"
                />
                <Area
                  type="monotone"
                  dataKey="transfer"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#dbeafe"
                  name="Transfers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {selectedView === "optimization" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            🚀 AI Storage Optimization Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storageOptimizations.map((optimization) => (
              <Card
                key={optimization.zone_id}
                className="p-6 bg-gradient-to-r from-blue-50 to-purple-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {optimization.zone_id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {optimization.current_layout} →{" "}
                      {optimization.optimized_layout}
                    </p>
                  </div>
                  <Badge
                    className={getEffortColor(
                      optimization.implementation_effort
                    )}
                  >
                    {optimization.implementation_effort} effort
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {optimization.space_savings}%
                    </p>
                    <p className="text-sm text-gray-600">Space Savings</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {optimization.access_improvement}%
                    </p>
                    <p className="text-sm text-gray-600">Access Improvement</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      Rp {(optimization.cost_reduction / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-600">Annual Savings</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {optimization.roi_months}
                    </p>
                    <p className="text-sm text-gray-600">ROI Months</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    💡 Implement
                  </Button>
                  <Button size="sm" variant="outline">
                    📊 Detailed Analysis
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {selectedView === "quality" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Quality Control Checks
            </h3>
            <Button className="bg-red-600 hover:bg-red-700">
              🔍 New Inspection
            </Button>
          </div>

          <div className="space-y-4">
            {qualityChecks.map((check) => (
              <Card key={check.check_id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {check.check_id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {check.zone_id} • {check.product_type} •{" "}
                      {check.batch_number}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getQualityColor(check.visual_inspection)}>
                      {check.visual_inspection}
                    </Badge>
                    <Badge
                      className={
                        check.contamination_risk === "low"
                          ? "bg-green-100 text-green-800"
                          : check.contamination_risk === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {check.contamination_risk} risk
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Moisture:</span>
                    <p className="font-medium">
                      {check.moisture_content.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Temperature:</span>
                    <p className="font-medium">
                      {check.temperature_check.toFixed(1)}°C
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Inspector:</span>
                    <p className="font-medium">{check.inspector}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">
                      {new Date(check.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Notes:</span>
                    <p className="text-gray-900">{check.notes}</p>
                  </div>
                  {check.corrective_action !== "No action needed" && (
                    <div>
                      <span className="text-gray-600 font-medium">
                        Action Required:
                      </span>
                      <p className="text-orange-600">
                        {check.corrective_action}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-cyan-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🤖 AI Warehouse Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                📦 Capacity Optimization
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Zone WH-C01 is at 95% capacity. Consider redistributing stock or
                expanding storage.
              </p>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Optimize Layout
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🌡️ Environmental Alert
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Temperature variance detected in Zone WH-B01. Check ventilation
                system.
              </p>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Schedule Maintenance
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🚀 Efficiency Opportunity
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Implementing automated storage system could improve access time
                by 45% and reduce labor costs.
              </p>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                Automation Plan
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                📊 Predictive Analytics
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Based on historical patterns, Zone WH-A01 will reach capacity in
                12 days.
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Prepare Expansion
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WarehouseManagement;
