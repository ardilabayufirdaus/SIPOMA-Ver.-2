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
  ScatterChart,
  Scatter,
} from "recharts";

interface StockPrediction {
  product_type: string;
  current_stock: number;
  predicted_demand: number;
  reorder_point: number;
  safety_stock: number;
  lead_time_days: number;
  stock_days_remaining: number;
  confidence_level: number;
  risk_level: "low" | "medium" | "high";
  recommended_action: string;
}

interface DemandForecast {
  date: string;
  historical_demand: number;
  predicted_demand: number;
  confidence_upper: number;
  confidence_lower: number;
  actual_demand?: number;
}

interface MLModel {
  model_name: string;
  accuracy: number;
  last_trained: string;
  features_used: string[];
  prediction_horizon: string;
  status: "active" | "training" | "inactive";
}

interface SeasonalPattern {
  month: string;
  demand_multiplier: number;
  historical_avg: number;
  predicted_avg: number;
}

const StockForecast = () => {
  const [stockPredictions, setStockPredictions] = useState<StockPrediction[]>(
    []
  );
  const [demandForecast, setDemandForecast] = useState<DemandForecast[]>([]);
  const [mlModels, setMLModels] = useState<MLModel[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>(
    []
  );
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [forecastHorizon, setForecastHorizon] = useState<
    "1week" | "1month" | "3months" | "6months"
  >("1month");

  // Simulate ML-powered stock forecasting
  useEffect(() => {
    const generateStockPredictions = (): StockPrediction[] => [
      {
        product_type: "OPC 50kg",
        current_stock: 12500 + Math.random() * 2000,
        predicted_demand: 8200 + Math.random() * 1000,
        reorder_point: 5000,
        safety_stock: 2000,
        lead_time_days: 3,
        stock_days_remaining: 15.2 + Math.random() * 3,
        confidence_level: 0.92 + Math.random() * 0.06,
        risk_level: "low",
        recommended_action: "Continue normal operations",
      },
      {
        product_type: "OPC 40kg",
        current_stock: 8700 + Math.random() * 1500,
        predicted_demand: 6800 + Math.random() * 800,
        reorder_point: 4000,
        safety_stock: 1500,
        lead_time_days: 3,
        stock_days_remaining: 12.8 + Math.random() * 2,
        confidence_level: 0.89 + Math.random() * 0.08,
        risk_level: "medium",
        recommended_action: "Monitor closely, prepare reorder",
      },
      {
        product_type: "PPC 50kg",
        current_stock: 4200 + Math.random() * 800,
        predicted_demand: 5500 + Math.random() * 700,
        reorder_point: 3500,
        safety_stock: 1200,
        lead_time_days: 4,
        stock_days_remaining: 7.6 + Math.random() * 2,
        confidence_level: 0.85 + Math.random() * 0.1,
        risk_level: "high",
        recommended_action: "Urgent reorder required",
      },
      {
        product_type: "PPC 40kg",
        current_stock: 6800 + Math.random() * 1200,
        predicted_demand: 4200 + Math.random() * 600,
        reorder_point: 3000,
        safety_stock: 1000,
        lead_time_days: 4,
        stock_days_remaining: 16.2 + Math.random() * 4,
        confidence_level: 0.91 + Math.random() * 0.07,
        risk_level: "low",
        recommended_action: "Stock levels optimal",
      },
      {
        product_type: "PSC 50kg",
        current_stock: 3100 + Math.random() * 600,
        predicted_demand: 3800 + Math.random() * 500,
        reorder_point: 2500,
        safety_stock: 800,
        lead_time_days: 5,
        stock_days_remaining: 8.1 + Math.random() * 1.5,
        confidence_level: 0.87 + Math.random() * 0.09,
        risk_level: "high",
        recommended_action: "Plan immediate production",
      },
      {
        product_type: "PSC 40kg",
        current_stock: 5400 + Math.random() * 1000,
        predicted_demand: 3200 + Math.random() * 400,
        reorder_point: 2200,
        safety_stock: 700,
        lead_time_days: 5,
        stock_days_remaining: 16.9 + Math.random() * 3,
        confidence_level: 0.93 + Math.random() * 0.05,
        risk_level: "low",
        recommended_action: "Stock levels excellent",
      },
    ];

    const generateDemandForecast = (): DemandForecast[] => {
      const forecast = [];
      const baseDate = new Date();

      // Historical data (last 30 days)
      for (let i = 30; i >= 1; i--) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - i);

        const baselineHistorical =
          5000 + Math.sin(i * 0.1) * 1000 + Math.random() * 800;

        forecast.push({
          date: date.toISOString().slice(0, 10),
          historical_demand: baselineHistorical,
          predicted_demand: baselineHistorical + (Math.random() - 0.5) * 200,
          confidence_upper: 0,
          confidence_lower: 0,
          actual_demand: baselineHistorical + (Math.random() - 0.5) * 300,
        });
      }

      // Future predictions
      for (let i = 1; i <= 30; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);

        const seasonalFactor = 1 + Math.sin(i * 0.15) * 0.2;
        const trendFactor = 1 + i * 0.002;
        const baseline =
          5200 * seasonalFactor * trendFactor + Math.random() * 600;

        forecast.push({
          date: date.toISOString().slice(0, 10),
          historical_demand: 0,
          predicted_demand: baseline,
          confidence_upper: baseline * 1.15,
          confidence_lower: baseline * 0.85,
        });
      }

      return forecast;
    };

    const generateMLModels = (): MLModel[] => [
      {
        model_name: "ARIMA-Seasonal",
        accuracy: 92.5 + Math.random() * 4,
        last_trained: "2024-01-14 08:30:00",
        features_used: [
          "Historical demand",
          "Seasonal patterns",
          "Market trends",
        ],
        prediction_horizon: "30 days",
        status: "active",
      },
      {
        model_name: "LSTM Neural Network",
        accuracy: 89.8 + Math.random() * 5,
        last_trained: "2024-01-13 22:15:00",
        features_used: [
          "Time series",
          "Weather data",
          "Economic indicators",
          "Production schedules",
        ],
        prediction_horizon: "90 days",
        status: "active",
      },
      {
        model_name: "Random Forest Ensemble",
        accuracy: 87.3 + Math.random() * 6,
        last_trained: "2024-01-14 06:45:00",
        features_used: [
          "Historical sales",
          "Inventory levels",
          "Supplier lead times",
        ],
        prediction_horizon: "14 days",
        status: "active",
      },
      {
        model_name: "Gradient Boosting",
        accuracy: 0,
        last_trained: "In progress...",
        features_used: ["Multi-variate time series", "External factors"],
        prediction_horizon: "60 days",
        status: "training",
      },
    ];

    const generateSeasonalPatterns = (): SeasonalPattern[] => [
      {
        month: "Jan",
        demand_multiplier: 0.85,
        historical_avg: 4200,
        predicted_avg: 4350,
      },
      {
        month: "Feb",
        demand_multiplier: 0.9,
        historical_avg: 4500,
        predicted_avg: 4680,
      },
      {
        month: "Mar",
        demand_multiplier: 1.15,
        historical_avg: 5750,
        predicted_avg: 5920,
      },
      {
        month: "Apr",
        demand_multiplier: 1.25,
        historical_avg: 6250,
        predicted_avg: 6420,
      },
      {
        month: "May",
        demand_multiplier: 1.35,
        historical_avg: 6750,
        predicted_avg: 6890,
      },
      {
        month: "Jun",
        demand_multiplier: 1.2,
        historical_avg: 6000,
        predicted_avg: 6150,
      },
      {
        month: "Jul",
        demand_multiplier: 1.1,
        historical_avg: 5500,
        predicted_avg: 5630,
      },
      {
        month: "Aug",
        demand_multiplier: 1.05,
        historical_avg: 5250,
        predicted_avg: 5380,
      },
      {
        month: "Sep",
        demand_multiplier: 1.3,
        historical_avg: 6500,
        predicted_avg: 6700,
      },
      {
        month: "Oct",
        demand_multiplier: 1.4,
        historical_avg: 7000,
        predicted_avg: 7280,
      },
      {
        month: "Nov",
        demand_multiplier: 1.25,
        historical_avg: 6250,
        predicted_avg: 6500,
      },
      {
        month: "Dec",
        demand_multiplier: 0.95,
        historical_avg: 4750,
        predicted_avg: 4920,
      },
    ];

    // Initial data
    setStockPredictions(generateStockPredictions());
    setDemandForecast(generateDemandForecast());
    setMLModels(generateMLModels());
    setSeasonalPatterns(generateSeasonalPatterns());

    // Update every 2 minutes
    const interval = setInterval(() => {
      setStockPredictions(generateStockPredictions());

      // Update ML model training status
      setMLModels((prev) =>
        prev.map((model) => {
          if (model.status === "training" && Math.random() > 0.7) {
            return {
              ...model,
              status: "active" as const,
              accuracy: 85 + Math.random() * 10,
              last_trained: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            };
          }
          return model;
        })
      );
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "training":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockLevel = (
    current: number,
    reorderPoint: number,
    safetyStock: number
  ) => {
    if (current <= safetyStock) return "critical";
    if (current <= reorderPoint) return "low";
    if (current <= reorderPoint * 1.5) return "medium";
    return "good";
  };

  const getStockColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500";
      case "low":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "good":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Filter and prepare chart data
  const filteredPredictions =
    selectedProduct === "all"
      ? stockPredictions
      : stockPredictions.filter((p) => p.product_type === selectedProduct);

  const demandTrendData = demandForecast.slice(-30).map((item) => ({
    date: item.date.slice(5),
    historical: item.historical_demand || null,
    predicted: item.predicted_demand,
    upper: item.confidence_upper || null,
    lower: item.confidence_lower || null,
    actual: item.actual_demand || null,
  }));

  const stockLevelsData = stockPredictions.map((prediction) => ({
    product: prediction.product_type,
    current: prediction.current_stock,
    reorder: prediction.reorder_point,
    safety: prediction.safety_stock,
    days_remaining: prediction.stock_days_remaining,
  }));

  const accuracyData = mlModels
    .filter((m) => m.status === "active")
    .map((model) => ({
      name: model.model_name.split(" ")[0],
      accuracy: model.accuracy,
      features: model.features_used.length,
    }));

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            AI-Powered Stock Forecast
          </h2>
          <p className="text-gray-600">
            Machine learning demand prediction and inventory optimization
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Products</option>
            {stockPredictions.map((p) => (
              <option key={p.product_type} value={p.product_type}>
                {p.product_type}
              </option>
            ))}
          </select>
          <select
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1week">1 Week</option>
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
          </select>
          <Button className="bg-red-600 hover:bg-red-700">
            🔄 Retrain Models
          </Button>
        </div>
      </div>

      {/* ML Model Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🤖 ML Model Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {mlModels.map((model, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {model.model_name}
                </h4>
                <Badge className={getStatusColor(model.status)}>
                  {model.status}
                </Badge>
              </div>

              {model.status === "active" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium text-green-600">
                      {model.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Horizon:</span>
                    <span className="font-medium">
                      {model.prediction_horizon}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last trained: {model.last_trained}
                  </div>
                </div>
              )}

              {model.status === "training" && (
                <div className="space-y-2">
                  <div className="text-sm text-blue-600">
                    Training in progress...
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full animate-pulse"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Model Accuracy Comparison
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[75, 100]} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Feature Complexity vs Accuracy
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="features" name="Features" />
                <YAxis dataKey="accuracy" name="Accuracy" domain={[75, 100]} />
                <Tooltip />
                <Scatter dataKey="accuracy" fill="#dc2626" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Stock Predictions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          📊 Stock Level Predictions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {filteredPredictions.map((prediction, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {prediction.product_type}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Current Stock: {prediction.current_stock.toLocaleString()}
                  </p>
                </div>
                <Badge className={getRiskColor(prediction.risk_level)}>
                  {prediction.risk_level} risk
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stock Level</span>
                    <span>
                      {prediction.stock_days_remaining.toFixed(1)} days
                      remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getStockColor(
                        getStockLevel(
                          prediction.current_stock,
                          prediction.reorder_point,
                          prediction.safety_stock
                        )
                      )}`}
                      style={{
                        width: `${Math.min(
                          100,
                          (prediction.current_stock /
                            (prediction.reorder_point * 2)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Predicted Demand:</span>
                    <p className="font-medium">
                      {prediction.predicted_demand.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Reorder Point:</span>
                    <p className="font-medium">
                      {prediction.reorder_point.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Safety Stock:</span>
                    <p className="font-medium">
                      {prediction.safety_stock.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Lead Time:</span>
                    <p className="font-medium">
                      {prediction.lead_time_days} days
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">AI Confidence:</span>
                    <span className="font-medium text-blue-600">
                      {(prediction.confidence_level * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {prediction.recommended_action}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Stock Levels Overview
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="product"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#dc2626" name="Current Stock" />
                <Bar dataKey="reorder" fill="#f59e0b" name="Reorder Point" />
                <Bar dataKey="safety" fill="#10b981" name="Safety Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Days of Stock Remaining
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="days_remaining" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Demand Forecast Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Demand Forecast Trends
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={demandTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#fecaca"
              fillOpacity={0.3}
              name="Confidence Band"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#6b7280"
              strokeWidth={2}
              name="Historical Demand"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2}
              name="Actual Demand"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#dc2626"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="ML Prediction"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Seasonal Patterns */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🌊 Seasonal Demand Patterns
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={seasonalPatterns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="historical_avg"
              stroke="#6b7280"
              fill="#f3f4f6"
              name="Historical Average"
            />
            <Area
              type="monotone"
              dataKey="predicted_avg"
              stroke="#dc2626"
              fill="#fef2f2"
              name="AI Predicted Average"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* AI Insights and Recommendations */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🧠 AI Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                📊 Demand Prediction Alert
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                PPC 50kg demand is predicted to increase by 23% in the next 2
                weeks due to seasonal construction activity.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Adjust Production Plan
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                ⚠️ Stock Risk Alert
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                PSC 50kg stock will reach critical levels in 8 days. Immediate
                production scheduling recommended.
              </p>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Emergency Production
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                💡 Optimization Opportunity
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Reducing safety stock for OPC 40kg by 15% could save $28K in
                carrying costs without increasing stockout risk.
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Optimize Parameters
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🎯 Model Enhancement
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Adding weather data and regional economic indicators could
                improve forecast accuracy by 4.2%.
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Enhance Models
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StockForecast;
