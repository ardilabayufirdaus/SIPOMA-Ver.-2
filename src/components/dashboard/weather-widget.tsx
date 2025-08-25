"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Droplets,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  visibility: number;
  description: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    windDirection: "NE",
    condition: "partly-cloudy",
    visibility: 8,
    description: "Partly Cloudy",
  });

  const [portImpact, setPortImpact] = useState<string>("low");

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather((prev) => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(
          30,
          Math.min(100, prev.humidity + (Math.random() - 0.5) * 10)
        ),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 5),
        visibility: Math.max(
          2,
          Math.min(15, prev.visibility + (Math.random() - 0.5) * 2)
        ),
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate port impact based on weather conditions
  useEffect(() => {
    if (weather.windSpeed > 25 || weather.visibility < 5) {
      setPortImpact("high");
    } else if (weather.windSpeed > 15 || weather.visibility < 8) {
      setPortImpact("medium");
    } else {
      setPortImpact("low");
    }
  }, [weather]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-blue-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      default:
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case "high":
        return "High Impact - Consider delays";
      case "medium":
        return "Medium Impact - Monitor conditions";
      default:
        return "Low Impact - Normal operations";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weather Conditions
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Port operations impact assessment
        </p>
      </div>

      <div className="p-6">
        {/* Current Weather */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.round(weather.temperature)}°C
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {weather.description}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {Math.round(weather.humidity)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Humidity
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {Math.round(weather.windSpeed)} km/h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Wind {weather.windDirection}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Thermometer className="h-4 w-4 text-red-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {Math.round(weather.visibility)} km
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Visibility
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Cloud className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                28°C
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Feels like
              </div>
            </div>
          </div>
        </div>

        {/* Port Operations Impact */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Port Operations Impact
          </h4>
          <div className={`p-3 rounded-lg ${getImpactColor(portImpact)}`}>
            <div className="text-sm font-medium">
              {getImpactText(portImpact)}
            </div>
            {portImpact !== "low" && (
              <div className="text-xs mt-1 opacity-80">
                {portImpact === "high"
                  ? "High winds or low visibility may affect loading operations"
                  : "Monitor weather conditions for potential impacts"}
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Last updated:{" "}
          {new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
