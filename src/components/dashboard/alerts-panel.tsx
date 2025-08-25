"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";

interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "High Temperature Alert",
      message: "Mill 4 operating temperature above threshold (85°C)",
      timestamp: "2 minutes ago",
      source: "Factory Control",
      acknowledged: false,
    },
    {
      id: "2",
      type: "info",
      title: "Vessel Arrival",
      message: "MV OCEAN PIONEER expected at berth 2 in 30 minutes",
      timestamp: "5 minutes ago",
      source: "Port Operations",
      acknowledged: false,
    },
    {
      id: "3",
      type: "error",
      title: "Low Stock Alert",
      message: "Medan Plant stock below critical level (3 days remaining)",
      timestamp: "15 minutes ago",
      source: "Packing Plant",
      acknowledged: false,
    },
    {
      id: "4",
      type: "success",
      title: "Maintenance Complete",
      message:
        "Scheduled maintenance on Conveyor Belt 2 completed successfully",
      timestamp: "1 hour ago",
      source: "Maintenance",
      acknowledged: true,
    },
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
      case "warning":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/10";
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/10";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10";
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const unacknowledgedCount = alerts.filter(
    (alert) => !alert.acknowledged
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Alerts
          </h3>
          {unacknowledgedCount > 0 && (
            <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
              {unacknowledgedCount} new
            </div>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>No active alerts</p>
            <p className="text-sm">All systems operating normally</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(
                  alert.type
                )} ${alert.acknowledged ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>{alert.source}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                              Acknowledge
                            </button>
                          )}
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            View All Alerts →
          </button>
        </div>
      )}
    </div>
  );
}
