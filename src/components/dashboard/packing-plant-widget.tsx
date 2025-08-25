"use client";

import { Package, MapPin, TrendingDown, AlertTriangle } from "lucide-react";

export function PackingPlantWidget() {
  const plants = [
    {
      id: "jkt",
      name: "Jakarta Plant",
      location: "Jakarta",
      currentStock: 8500,
      capacity: 10000,
      daysOfStock: 12,
      status: "normal",
    },
    {
      id: "sby",
      name: "Surabaya Plant",
      location: "Surabaya",
      currentStock: 6200,
      capacity: 8000,
      daysOfStock: 8,
      status: "normal",
    },
    {
      id: "mdn",
      name: "Medan Plant",
      location: "Medan",
      currentStock: 1800,
      capacity: 6000,
      daysOfStock: 3,
      status: "low",
    },
  ];

  const getUtilization = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "low":
        return "text-orange-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "low":
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalStock = plants.reduce((sum, plant) => sum + plant.currentStock, 0);
  const totalCapacity = plants.reduce((sum, plant) => sum + plant.capacity, 0);
  const overallUtilization = getUtilization(totalStock, totalCapacity);
  const lowStockPlants = plants.filter(
    (plant) => plant.status === "low"
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Packing Plants
            </h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {overallUtilization}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Overall Utilization
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat("id-ID").format(totalStock)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Stock (tons)
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {lowStockPlants}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Low Stock Alerts
            </div>
          </div>
        </div>

        {/* Plant List */}
        <div className="space-y-4">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {plant.name}
                  </h4>
                  {getStatusIcon(plant.status)}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{plant.location}</span>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Stock Level
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Intl.NumberFormat("id-ID").format(plant.currentStock)}{" "}
                    / {new Intl.NumberFormat("id-ID").format(plant.capacity)}{" "}
                    tons
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      plant.status === "low"
                        ? "bg-orange-500"
                        : plant.status === "critical"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${getUtilization(
                        plant.currentStock,
                        plant.capacity
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Days of Stock */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Days of Stock
                </span>
                <span className={`font-medium ${getStatusColor(plant.status)}`}>
                  {plant.daysOfStock} days
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              View Stock Forecast
            </button>
            <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">
              Manage Distribution →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
