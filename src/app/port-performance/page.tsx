"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import components
import PortOverview from "@/components/port-performance/port-overview";
import VesselManagement from "@/components/port-performance/vessel-management";
import BerthManagement from "@/components/port-performance/berth-management";
import DeliveryPlanning from "@/components/port-performance/delivery-planning";
import BupBorSirani from "@/components/port-performance/bup-bor-sirani";
import LoadingOptimization from "@/components/port-performance/loading-optimization";
import WeatherIntegration from "@/components/port-performance/weather-integration";
import PortAnalytics from "@/components/port-performance/port-analytics";

const PortPerformancePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Port Overview", icon: "⚓" },
    { id: "vessels", label: "Vessel Management", icon: "🚢" },
    { id: "berths", label: "Berth Management", icon: "🏗️" },
    { id: "delivery", label: "Delivery Planning", icon: "📋" },
    { id: "bup-bor", label: "BUP/BOR/SIRANI", icon: "📊" },
    { id: "loading", label: "Loading Optimization", icon: "⚡" },
    { id: "weather", label: "Weather Integration", icon: "🌤️" },
    { id: "analytics", label: "Port Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Port Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Maritime operations optimization system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              🌊 Tide: High
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              ⚓ 3 Vessels Active
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              🏗️ 2/3 Berths Occupied
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
            <PortOverview />
          </TabsContent>

          <TabsContent value="vessels">
            <VesselManagement />
          </TabsContent>

          <TabsContent value="berths">
            <BerthManagement />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryPlanning />
          </TabsContent>

          <TabsContent value="bup-bor">
            <BupBorSirani />
          </TabsContent>

          <TabsContent value="loading">
            <LoadingOptimization />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherIntegration />
          </TabsContent>

          <TabsContent value="analytics">
            <PortAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortPerformancePage;
