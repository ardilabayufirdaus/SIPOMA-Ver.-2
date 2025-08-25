import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { FactoryStatusWidget } from "@/components/dashboard/factory-status-widget";
import { PortPerformanceWidget } from "@/components/dashboard/port-performance-widget";
import { PackingPlantWidget } from "@/components/dashboard/packing-plant-widget";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { ProductionChart } from "@/components/dashboard/production-chart";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Dashboard - SIPOMA",
  description:
    "Real-time operations center untuk monitoring operasi manufaktur semen",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 px-2 sm:px-4 md:px-8 py-6 space-y-8">
          {/* Key Performance Indicators */}
          <DashboardStats />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Widgets */}
            <div className="lg:col-span-8 space-y-8">
              {/* Factory Status */}
              <FactoryStatusWidget />

              {/* Production Chart */}
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-shadow duration-300">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    Production Trends
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Real-time production metrics dan trend analysis
                  </p>
                </div>
                <div className="p-6">
                  <ProductionChart />
                </div>
              </div>

              {/* Port & Packing Plant Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hover:scale-[1.02] transition-transform duration-200">
                  <PortPerformanceWidget />
                </div>
                <div className="hover:scale-[1.02] transition-transform duration-200">
                  <PackingPlantWidget />
                </div>
              </div>
            </div>

            {/* Right Column - Side Widgets */}
            <div className="lg:col-span-4 space-y-8">
              {/* Weather Widget */}
              <div className="hover:shadow-xl transition-shadow duration-200 rounded-2xl">
                <WeatherWidget />
              </div>

              {/* Alerts Panel */}
              <div className="hover:shadow-xl transition-shadow duration-200 rounded-2xl">
                <AlertsPanel />
              </div>

              {/* Quick Actions */}
              <div className="hover:shadow-xl transition-shadow duration-200 rounded-2xl">
                <QuickActions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
