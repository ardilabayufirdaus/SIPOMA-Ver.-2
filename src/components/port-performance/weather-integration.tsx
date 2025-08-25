"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeatherData {
  timestamp: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wave_height: number;
  visibility: number;
  precipitation: number;
  pressure: number;
  weather_condition: string;
  risk_level: "low" | "medium" | "high" | "extreme";
}

interface WeatherForecast {
  date: string;
  day_condition: string;
  night_condition: string;
  max_temp: number;
  min_temp: number;
  wind_speed: number;
  wave_height: number;
  precipitation_chance: number;
  operational_impact: {
    loading_operations: "normal" | "limited" | "suspended";
    vessel_movement: "normal" | "restricted" | "prohibited";
    crane_operations: "normal" | "limited" | "suspended";
  };
}

interface WeatherAlert {
  id: string;
  type: "wind" | "rain" | "wave" | "visibility" | "storm";
  severity: "warning" | "watch" | "advisory";
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  affected_operations: string[];
  recommendations: string[];
  auto_actions: string[];
}

interface OperationalImpact {
  operation: string;
  current_status: "normal" | "limited" | "suspended";
  weather_factor: string;
  impact_level: number;
  estimated_delay: number;
  mitigation_actions: string[];
}

const WeatherIntegration = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [operationalImpacts, setOperationalImpacts] = useState<
    OperationalImpact[]
  >([]);

  // Simulate real-time weather data updates
  useEffect(() => {
    const generateWeatherData = (timestamp: string): WeatherData => {
      const baseTemp = 28 + Math.sin(Date.now() / 3600000) * 5; // Daily temperature cycle
      const conditions = [
        "Clear",
        "Partly Cloudy",
        "Cloudy",
        "Light Rain",
        "Heavy Rain",
        "Thunderstorm",
      ];
      const windSpeed = 8 + Math.random() * 15;
      const waveHeight = 1.2 + Math.random() * 2.5;

      let riskLevel: "low" | "medium" | "high" | "extreme" = "low";
      if (windSpeed > 20 || waveHeight > 3) riskLevel = "medium";
      if (windSpeed > 30 || waveHeight > 4) riskLevel = "high";
      if (windSpeed > 40 || waveHeight > 5) riskLevel = "extreme";

      return {
        timestamp,
        temperature: baseTemp + (Math.random() - 0.5) * 6,
        humidity: 70 + Math.random() * 20,
        wind_speed: windSpeed,
        wind_direction: Math.random() * 360,
        wave_height: waveHeight,
        visibility: 8 + Math.random() * 4,
        precipitation: Math.random() * 10,
        pressure: 1012 + (Math.random() - 0.5) * 8,
        weather_condition:
          conditions[Math.floor(Math.random() * conditions.length)],
        risk_level: riskLevel,
      };
    };

    const generateForecast = (): WeatherForecast[] => [
      {
        date: "2024-01-15",
        day_condition: "Partly Cloudy",
        night_condition: "Clear",
        max_temp: 32,
        min_temp: 25,
        wind_speed: 12,
        wave_height: 1.8,
        precipitation_chance: 20,
        operational_impact: {
          loading_operations: "normal",
          vessel_movement: "normal",
          crane_operations: "normal",
        },
      },
      {
        date: "2024-01-16",
        day_condition: "Cloudy",
        night_condition: "Light Rain",
        max_temp: 30,
        min_temp: 24,
        wind_speed: 18,
        wave_height: 2.5,
        precipitation_chance: 60,
        operational_impact: {
          loading_operations: "limited",
          vessel_movement: "normal",
          crane_operations: "limited",
        },
      },
      {
        date: "2024-01-17",
        day_condition: "Heavy Rain",
        night_condition: "Thunderstorm",
        max_temp: 28,
        min_temp: 22,
        wind_speed: 25,
        wave_height: 3.2,
        precipitation_chance: 85,
        operational_impact: {
          loading_operations: "suspended",
          vessel_movement: "restricted",
          crane_operations: "suspended",
        },
      },
      {
        date: "2024-01-18",
        day_condition: "Light Rain",
        night_condition: "Partly Cloudy",
        max_temp: 31,
        min_temp: 24,
        wind_speed: 15,
        wave_height: 2.0,
        precipitation_chance: 40,
        operational_impact: {
          loading_operations: "limited",
          vessel_movement: "normal",
          crane_operations: "normal",
        },
      },
      {
        date: "2024-01-19",
        day_condition: "Clear",
        night_condition: "Clear",
        max_temp: 33,
        min_temp: 26,
        wind_speed: 10,
        wave_height: 1.5,
        precipitation_chance: 10,
        operational_impact: {
          loading_operations: "normal",
          vessel_movement: "normal",
          crane_operations: "normal",
        },
      },
    ];

    const generateAlerts = (): WeatherAlert[] => [
      {
        id: "alert-1",
        type: "wind",
        severity: "warning",
        title: "High Wind Warning",
        description: "Wind speeds expected to reach 25-30 knots from southeast",
        start_time: "2024-01-17 06:00",
        end_time: "2024-01-17 18:00",
        affected_operations: ["Crane Operations", "Small Vessel Movement"],
        recommendations: [
          "Suspend crane operations above 25 knots",
          "Delay small vessel movements",
          "Secure loose equipment",
        ],
        auto_actions: [
          "Crane operations auto-suspended at 25 knots",
          "Alert sent to all operators",
        ],
      },
      {
        id: "alert-2",
        type: "rain",
        severity: "watch",
        title: "Heavy Rain Watch",
        description: "Potential for heavy rainfall (15-25mm/hour) expected",
        start_time: "2024-01-17 10:00",
        end_time: "2024-01-17 22:00",
        affected_operations: ["Loading Operations", "Cement Handling"],
        recommendations: [
          "Prepare weather protection for cement products",
          "Monitor drainage systems",
          "Reduce outdoor operations",
        ],
        auto_actions: [
          "Cement storage covers activated",
          "Drainage pumps on standby",
        ],
      },
    ];

    const generateOperationalImpacts = (): OperationalImpact[] => [
      {
        operation: "Ship Loader 1",
        current_status: "normal",
        weather_factor: "Wind Speed",
        impact_level: 15,
        estimated_delay: 0,
        mitigation_actions: [
          "Wind speed monitoring",
          "Equipment stabilization",
        ],
      },
      {
        operation: "Grab Crane A",
        current_status: "limited",
        weather_factor: "Wind Speed",
        impact_level: 45,
        estimated_delay: 2.5,
        mitigation_actions: [
          "Reduce lifting height",
          "Increase safety margins",
        ],
      },
      {
        operation: "Cement Storage",
        current_status: "normal",
        weather_factor: "Precipitation",
        impact_level: 25,
        estimated_delay: 0,
        mitigation_actions: ["Weather covers deployed", "Moisture monitoring"],
      },
      {
        operation: "Vessel Navigation",
        current_status: "normal",
        weather_factor: "Visibility",
        impact_level: 20,
        estimated_delay: 0.5,
        mitigation_actions: ["Enhanced radar monitoring", "Pilot assistance"],
      },
    ];

    // Generate initial data
    const now = new Date();
    const currentWeatherData = generateWeatherData(now.toISOString());
    setCurrentWeather(currentWeatherData);

    // Generate 24 hours of historical data
    const history = [];
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 3600000).toISOString();
      history.push(generateWeatherData(timestamp));
    }
    setWeatherHistory(history);

    setForecast(generateForecast());
    setAlerts(generateAlerts());
    setOperationalImpacts(generateOperationalImpacts());

    // Update every 60 seconds
    const interval = setInterval(() => {
      const newWeatherData = generateWeatherData(new Date().toISOString());
      setCurrentWeather(newWeatherData);

      // Update history (keep last 24 hours)
      setWeatherHistory((prev) => [...prev.slice(1), newWeatherData]);

      // Update operational impacts based on current weather
      setOperationalImpacts((prev) =>
        prev.map((impact) => {
          let newStatus = impact.current_status;
          let newImpactLevel = impact.impact_level;
          let newDelay = impact.estimated_delay;

          if (
            newWeatherData.wind_speed > 25 &&
            impact.weather_factor === "Wind Speed"
          ) {
            newStatus = "limited";
            newImpactLevel = Math.min(80, impact.impact_level + 10);
            newDelay = Math.max(impact.estimated_delay, 1.5);
          } else if (
            newWeatherData.wind_speed > 35 &&
            impact.weather_factor === "Wind Speed"
          ) {
            newStatus = "suspended";
            newImpactLevel = 90;
            newDelay = 4;
          } else if (
            newWeatherData.precipitation > 5 &&
            impact.weather_factor === "Precipitation"
          ) {
            newStatus = "limited";
            newImpactLevel = Math.min(70, impact.impact_level + 15);
          }

          return {
            ...impact,
            current_status: newStatus,
            impact_level: newImpactLevel,
            estimated_delay: newDelay,
          };
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "extreme":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "advisory":
        return "bg-blue-100 text-blue-800";
      case "watch":
        return "bg-yellow-100 text-yellow-800";
      case "warning":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOperationalStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "restricted":
        return "bg-orange-100 text-orange-800";
      case "prohibited":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "☀️";
      case "partly cloudy":
        return "⛅";
      case "cloudy":
        return "☁️";
      case "light rain":
        return "🌦️";
      case "heavy rain":
        return "🌧️";
      case "thunderstorm":
        return "⛈️";
      default:
        return "🌤️";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "wind":
        return "💨";
      case "rain":
        return "🌧️";
      case "wave":
        return "🌊";
      case "visibility":
        return "🌫️";
      case "storm":
        return "⛈️";
      default:
        return "⚠️";
    }
  };

  // Chart data
  const weatherTrendData = weatherHistory.map((data) => ({
    time: new Date(data.timestamp).getHours() + ":00",
    temp: data.temperature,
    wind: data.wind_speed,
    wave: data.wave_height,
    humidity: data.humidity,
    pressure: data.pressure,
  }));

  const forecastData = forecast.map((day) => ({
    date: day.date.split("-").slice(-1)[0],
    max_temp: day.max_temp,
    min_temp: day.min_temp,
    wind: day.wind_speed,
    wave: day.wave_height,
    rain_chance: day.precipitation_chance,
  }));

  const impactData = operationalImpacts.map((impact) => ({
    operation: impact.operation.split(" ").slice(-1)[0],
    impact: impact.impact_level,
    delay: impact.estimated_delay,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Weather Integration
          </h2>
          <p className="text-gray-600">
            Real-time weather monitoring and operational impact analysis
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">Update Forecast</Button>
      </div>

      {/* Current Weather Card */}
      {currentWeather && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Current Weather
            </h3>
            <Badge className={getRiskColor(currentWeather.risk_level)}>
              {currentWeather.risk_level.toUpperCase()} RISK
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">
                {getWeatherIcon(currentWeather.weather_condition)}
              </div>
              <p className="text-sm text-gray-600">Condition</p>
              <p className="font-medium">{currentWeather.weather_condition}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {currentWeather.temperature.toFixed(1)}°C
              </div>
              <p className="text-sm text-gray-600">Temperature</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {currentWeather.wind_speed.toFixed(0)} kt
              </div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-xs text-gray-500">
                {currentWeather.wind_direction.toFixed(0)}°
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-2">
                {currentWeather.wave_height.toFixed(1)} m
              </div>
              <p className="text-sm text-gray-600">Wave Height</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {currentWeather.visibility.toFixed(0)} km
              </div>
              <p className="text-sm text-gray-600">Visibility</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {currentWeather.humidity.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Humidity</p>
            </div>
          </div>
        </Card>
      )}

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Weather Alerts
          </h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {alert.start_time} - {alert.end_time}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  {alert.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Affected Operations
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {alert.affected_operations.map((op, index) => (
                        <li key={index}>• {op}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Recommendations
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {alert.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {alert.auto_actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <h5 className="font-medium text-gray-900 mb-2">
                      Automated Actions
                    </h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {alert.auto_actions.map((action, index) => (
                        <li key={index}>✓ {action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weather Charts and Operational Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            24-Hour Weather Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weatherTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#dc2626"
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="wind"
                stroke="#3b82f6"
                name="Wind (kt)"
              />
              <Line
                type="monotone"
                dataKey="wave"
                stroke="#06b6d4"
                name="Wave (m)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Operational Impact */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Operational Impact
          </h3>
          <div className="space-y-4">
            {operationalImpacts.map((impact, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {impact.operation}
                  </h4>
                  <Badge
                    className={getOperationalStatusColor(impact.current_status)}
                  >
                    {impact.current_status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Weather Factor:</span>
                    <span className="ml-2">{impact.weather_factor}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Impact Level:</span>
                    <span className="ml-2">{impact.impact_level}%</span>
                  </div>
                </div>

                {impact.estimated_delay > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    ⏱️ Estimated delay: {impact.estimated_delay} hours
                  </div>
                )}

                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Impact Level</span>
                    <span className="text-xs text-gray-600">
                      {impact.impact_level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        impact.impact_level < 30
                          ? "bg-green-600"
                          : impact.impact_level < 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${impact.impact_level}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5-Day Forecast */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-gray-900 mb-2">
                {day.date}
              </div>

              <div className="flex justify-center space-x-2 mb-3">
                <div className="text-center">
                  <div className="text-2xl">
                    {getWeatherIcon(day.day_condition)}
                  </div>
                  <div className="text-xs text-gray-600">Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">
                    {getWeatherIcon(day.night_condition)}
                  </div>
                  <div className="text-xs text-gray-600">Night</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>High:</span>
                  <span className="font-medium">{day.max_temp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Low:</span>
                  <span className="font-medium">{day.min_temp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind:</span>
                  <span className="font-medium">{day.wind_speed} kt</span>
                </div>
                <div className="flex justify-between">
                  <span>Waves:</span>
                  <span className="font-medium">{day.wave_height} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Rain:</span>
                  <span className="font-medium">
                    {day.precipitation_chance}%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <h5 className="text-xs font-medium text-gray-900 mb-2">
                  Operations
                </h5>
                <div className="space-y-1">
                  <Badge
                    className={`${getOperationalStatusColor(
                      day.operational_impact.loading_operations
                    )} text-xs`}
                  >
                    Loading: {day.operational_impact.loading_operations}
                  </Badge>
                  <Badge
                    className={`${getOperationalStatusColor(
                      day.operational_impact.vessel_movement
                    )} text-xs`}
                  >
                    Vessels: {day.operational_impact.vessel_movement}
                  </Badge>
                  <Badge
                    className={`${getOperationalStatusColor(
                      day.operational_impact.crane_operations
                    )} text-xs`}
                  >
                    Cranes: {day.operational_impact.crane_operations}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weather Statistics and Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            5-Day Weather Forecast
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="max_temp"
                stackId="1"
                stroke="#dc2626"
                fill="#fef2f2"
                name="Max Temp (°C)"
              />
              <Area
                type="monotone"
                dataKey="min_temp"
                stackId="2"
                stroke="#3b82f6"
                fill="#eff6ff"
                name="Min Temp (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Impact Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="operation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impact" fill="#dc2626" name="Impact Level %" />
              <Bar dataKey="delay" fill="#f59e0b" name="Delay (hours)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default WeatherIntegration;
