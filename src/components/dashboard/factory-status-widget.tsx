"use client";

import { useEffect, useState } from "react";
import { Activity, Power, Wrench, AlertCircle } from "lucide-react";

interface MillStatus {
  id: string;
  name: string;
  status: "operational" | "maintenance" | "stopped" | "warning";
  production: number;
  efficiency: number;
  lastUpdate: string;
}

export function FactoryStatusWidget() {
  const [mills, setMills] = useState<MillStatus[]>([
    {
      id: "mill-1",
      name: "Finish Mill 1",
      status: "operational",
      production: 120,
      efficiency: 87.5,
      lastUpdate: "2 minutes ago",
    },
    {
      id: "mill-2",
      name: "Finish Mill 2",
      status: "operational",
      production: 115,
      efficiency: 92.1,
      lastUpdate: "1 minute ago",
    },
    {
      id: "mill-3",
      name: "Finish Mill 3",
      status: "maintenance",
      production: 0,
      efficiency: 0,
      lastUpdate: "30 minutes ago",
    },
    {
      id: "mill-4",
      name: "Finish Mill 4",
      status: "warning",
      production: 95,
      efficiency: 65.3,
      lastUpdate: "3 minutes ago",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <Activity className="h-5 w-5 text-green-500" />;
      case "maintenance":
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case "stopped":
        return <Power className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "stopped":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "warning":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMills((prev) =>
        prev.map((mill) => {
          if (mill.status === "operational") {
            return {
              ...mill,
              production: mill.production + (Math.random() - 0.5) * 10,
              efficiency: Math.min(
                100,
                Math.max(0, mill.efficiency + (Math.random() - 0.5) * 5)
              ),
              lastUpdate: "Just now",
            };
          }
          return mill;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalProduction = mills.reduce((sum, mill) => sum + mill.production, 0);
  const averageEfficiency =
    mills.reduce((sum, mill) => sum + mill.efficiency, 0) / mills.length;
  const operationalMills = mills.filter(
    (mill) => mill.status === "operational"
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Factory Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time manufacturing operations monitoring
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {operationalMills}/{mills.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Mills Operating
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(totalProduction)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total TPH
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(averageEfficiency)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Avg Efficiency
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {operationalMills}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Active Mills
            </div>
          </div>
        </div>

        {/* Mill List */}
        <div className="space-y-4">
          {mills.map((mill) => (
            <div
              key={mill.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(mill.status)}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {mill.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Updated {mill.lastUpdate}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round(mill.production)} TPH
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(mill.efficiency)}% efficiency
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    mill.status
                  )}`}
                >
                  {mill.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
