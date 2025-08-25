"use client";

import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  format?: "number" | "percentage" | "currency";
  icon: React.ReactNode;
  color: "red" | "green" | "blue" | "yellow";
}

function StatCard({
  title,
  value,
  change,
  changeType,
  format = "number",
  icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    red: "from-red-500 to-red-600",
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
  };

  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;

    switch (format) {
      case "percentage":
        return `${val}%`;
      case "currency":
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(val);
      default:
        return new Intl.NumberFormat("id-ID").format(val);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}
            >
              {icon}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatValue(value)}
                </div>
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {changeType === "increase" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="sr-only">
                    {changeType === "increase" ? "Increased" : "Decreased"} by
                  </span>
                  {Math.abs(change)}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: "Total Production Today",
      value: 2840,
      change: 12.5,
      changeType: "increase" as const,
      format: "number" as const,
      icon: <Activity className="h-6 w-6" />,
      color: "red" as const,
    },
    {
      title: "Factory Efficiency",
      value: 87.3,
      change: 2.1,
      changeType: "increase" as const,
      format: "percentage" as const,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "green" as const,
    },
    {
      title: "Active Vessels",
      value: 8,
      change: -5.2,
      changeType: "decrease" as const,
      format: "number" as const,
      icon: <Activity className="h-6 w-6" />,
      color: "blue" as const,
    },
    {
      title: "Active Alerts",
      value: 3,
      change: -15.8,
      changeType: "decrease" as const,
      format: "number" as const,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "yellow" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
