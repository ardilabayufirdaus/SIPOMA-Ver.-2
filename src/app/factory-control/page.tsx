import { Metadata } from "next";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CCRDataEntry from "@/components/factory-control/ccr-data-entry";
import AutonomousMonitoring from "@/components/factory-control/autonomous-monitoring";
import FactoryOverview from "@/components/factory-control/factory-overview";
import MillManagement from "@/components/factory-control/mill-management";
import ParameterTracking from "@/components/factory-control/parameter-tracking";
import DowntimeLogger from "@/components/factory-control/downtime-logger";
import QualityControl from "@/components/factory-control/quality-control";
import EnergyMonitoring from "@/components/factory-control/energy-monitoring";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Factory Control - SIPOMA",
  description: "Real-time factory control and monitoring system",
};

export default function FactoryControlPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Factory Control</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring dan kontrol operasi pabrik semen
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-8 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ccr-data">CCR Data</TabsTrigger>
          <TabsTrigger value="autonomous">Autonomous</TabsTrigger>
          <TabsTrigger value="mills">Mills</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="downtime">Downtime</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <FactoryOverview />
          </Suspense>
        </TabsContent>

        <TabsContent value="ccr-data" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <CCRDataEntry />
          </Suspense>
        </TabsContent>

        <TabsContent value="autonomous" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <AutonomousMonitoring />
          </Suspense>
        </TabsContent>

        <TabsContent value="mills" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <MillManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <ParameterTracking />
          </Suspense>
        </TabsContent>

        <TabsContent value="downtime" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <DowntimeLogger />
          </Suspense>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <QualityControl />
          </Suspense>
        </TabsContent>

        <TabsContent value="energy" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <EnergyMonitoring />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
    </div>
  );
}
