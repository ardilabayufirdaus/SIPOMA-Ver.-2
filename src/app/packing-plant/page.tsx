"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import components
import PackingOverview from "@/components/packing-plant/packing-overview";
import StockForecast from "@/components/packing-plant/stock-forecast";
import DistributionLogistics from "@/components/packing-plant/distribution-logistics";
import PackerPerformance from "@/components/packing-plant/packer-performance";
import WarehouseManagement from "@/components/packing-plant/warehouse-management";
import QualityControl from "@/components/packing-plant/quality-control";
import InventoryTracking from "@/components/packing-plant/inventory-tracking";
import PackingAnalytics from "@/components/packing-plant/packing-analytics";

const PackingPlantPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Packing Overview", icon: "📦" },
    { id: "forecast", label: "Stock Forecast", icon: "📊" },
    { id: "logistics", label: "Distribution Logistics", icon: "🚛" },
    { id: "performance", label: "Packer Performance", icon: "⚡" },
    { id: "warehouse", label: "Warehouse Management", icon: "🏪" },
    { id: "quality", label: "Quality Control", icon: "✅" },
    { id: "inventory", label: "Inventory Tracking", icon: "📋" },
    { id: "analytics", label: "Packing Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Packing Plant</h1>
            <p className="text-gray-600 mt-1">
              Smart packaging operations center with AI-powered optimization
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              📦 8 Lines Active
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              🚛 12 Trucks Loading
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              ⚡ 89% Efficiency
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              🤖 AI Optimization ON
            </Badge>
          </div>
        </div>
      </div>

      {/* Tab Navigation and Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <PackingOverview />
          </TabsContent>

          <TabsContent value="forecast">
            <StockForecast />
          </TabsContent>

          <TabsContent value="logistics">
            <DistributionLogistics />
          </TabsContent>

          <TabsContent value="performance">
            <PackerPerformance />
          </TabsContent>

          <TabsContent value="warehouse">
            <WarehouseManagement />
          </TabsContent>

          <TabsContent value="quality">
            <QualityControl />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTracking />
          </TabsContent>

          <TabsContent value="analytics">
            <PackingAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PackingPlantPage;
