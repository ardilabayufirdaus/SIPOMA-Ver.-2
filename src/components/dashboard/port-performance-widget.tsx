"use client";

import { Ship, Anchor, Clock, TrendingUp } from "lucide-react";

export function PortPerformanceWidget() {
  const portMetrics = {
    vesselsInPort: 8,
    berthUtilization: 75,
    avgLoadingRate: 850,
    avgTurnaroundTime: 28,
  };

  const recentVessels = [
    {
      id: 1,
      name: "MV CEMENT STAR",
      status: "loading",
      progress: 65,
      eta: "14:30",
      cargo: "Cement Bulk",
    },
    {
      id: 2,
      name: "MV OCEAN PIONEER",
      status: "waiting",
      progress: 0,
      eta: "16:45",
      cargo: "Clinker",
    },
    {
      id: 3,
      name: "MV TRADE WIND",
      status: "completed",
      progress: 100,
      eta: "12:15",
      cargo: "Cement Bags",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "loading":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ship className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Port Performance
            </h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {portMetrics.vesselsInPort}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Vessels in Port
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Anchor className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {portMetrics.berthUtilization}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Berth Utilization
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {portMetrics.avgLoadingRate}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Avg Loading Rate (TPH)
            </div>
          </div>
        </div>

        {/* Recent Vessels */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Active Vessels
          </h4>
          <div className="space-y-3">
            {recentVessels.map((vessel) => (
              <div
                key={vessel.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-sm text-gray-900 dark:text-white">
                      {vessel.name}
                    </h5>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        vessel.status
                      )}`}
                    >
                      {vessel.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{vessel.cargo}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {vessel.eta}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${vessel.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Avg Turnaround: {portMetrics.avgTurnaroundTime}h</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
