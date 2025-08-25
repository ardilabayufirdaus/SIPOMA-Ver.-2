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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceMetrics {
  period: string;
  throughput: number;
  berth_utilization: number;
  vessel_turnaround: number;
  loading_efficiency: number;
  otif_performance: number;
  revenue: number;
  cost_per_ton: number;
  energy_consumption: number;
  safety_incidents: number;
  customer_satisfaction: number;
}

interface BenchmarkData {
  metric: string;
  current_value: number;
  target_value: number;
  industry_average: number;
  best_practice: number;
  trend: "up" | "down" | "stable";
  improvement_potential: number;
}

interface PredictiveAnalytics {
  metric: string;
  current_value: number;
  predicted_value: number;
  confidence_level: number;
  prediction_horizon: string;
  influencing_factors: string[];
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high";
}

interface KPITrend {
  date: string;
  throughput: number;
  efficiency: number;
  utilization: number;
  revenue: number;
  turnaround: number;
  otif: number;
}

const PortAnalytics = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetrics[]
  >([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<
    PredictiveAnalytics[]
  >([]);
  const [kpiTrends, setKpiTrends] = useState<KPITrend[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [selectedMetric, setSelectedMetric] = useState<string>("throughput");

  // Simulate real-time analytics data
  useEffect(() => {
    const generatePerformanceMetrics = (): PerformanceMetrics[] => [
      {
        period: "January 2024",
        throughput: 125000 + Math.random() * 15000,
        berth_utilization: 75 + Math.random() * 15,
        vessel_turnaround: 18 + Math.random() * 6,
        loading_efficiency: 85 + Math.random() * 10,
        otif_performance: 92 + Math.random() * 6,
        revenue: 2500000 + Math.random() * 300000,
        cost_per_ton: 18.5 + Math.random() * 3,
        energy_consumption: 450000 + Math.random() * 50000,
        safety_incidents: Math.floor(Math.random() * 3),
        customer_satisfaction: 8.2 + Math.random() * 1.5,
      },
      {
        period: "December 2023",
        throughput: 118000 + Math.random() * 12000,
        berth_utilization: 72 + Math.random() * 12,
        vessel_turnaround: 19 + Math.random() * 5,
        loading_efficiency: 82 + Math.random() * 8,
        otif_performance: 89 + Math.random() * 8,
        revenue: 2300000 + Math.random() * 250000,
        cost_per_ton: 19.2 + Math.random() * 2.5,
        energy_consumption: 465000 + Math.random() * 45000,
        safety_incidents: Math.floor(Math.random() * 4),
        customer_satisfaction: 7.8 + Math.random() * 1.2,
      },
      {
        period: "November 2023",
        throughput: 112000 + Math.random() * 10000,
        berth_utilization: 68 + Math.random() * 10,
        vessel_turnaround: 21 + Math.random() * 4,
        loading_efficiency: 79 + Math.random() * 7,
        otif_performance: 87 + Math.random() * 7,
        revenue: 2100000 + Math.random() * 200000,
        cost_per_ton: 20.1 + Math.random() * 2,
        energy_consumption: 480000 + Math.random() * 40000,
        safety_incidents: Math.floor(Math.random() * 5),
        customer_satisfaction: 7.5 + Math.random() * 1,
      },
    ];

    const generateBenchmarkData = (): BenchmarkData[] => [
      {
        metric: "Throughput (tons/month)",
        current_value: 125000,
        target_value: 150000,
        industry_average: 110000,
        best_practice: 180000,
        trend: "up",
        improvement_potential: 16.7,
      },
      {
        metric: "Berth Utilization (%)",
        current_value: 75,
        target_value: 85,
        industry_average: 70,
        best_practice: 92,
        trend: "up",
        improvement_potential: 13.3,
      },
      {
        metric: "Vessel Turnaround (hours)",
        current_value: 18,
        target_value: 16,
        industry_average: 22,
        best_practice: 14,
        trend: "down",
        improvement_potential: 11.1,
      },
      {
        metric: "Loading Efficiency (%)",
        current_value: 85,
        target_value: 90,
        industry_average: 78,
        best_practice: 95,
        trend: "up",
        improvement_potential: 5.9,
      },
      {
        metric: "OTIF Performance (%)",
        current_value: 92,
        target_value: 95,
        industry_average: 88,
        best_practice: 98,
        trend: "stable",
        improvement_potential: 3.3,
      },
      {
        metric: "Cost per Ton ($)",
        current_value: 18.5,
        target_value: 16.0,
        industry_average: 21.0,
        best_practice: 14.5,
        trend: "down",
        improvement_potential: 13.5,
      },
    ];

    const generatePredictiveAnalytics = (): PredictiveAnalytics[] => [
      {
        metric: "Monthly Throughput",
        current_value: 125000,
        predicted_value: 142000,
        confidence_level: 0.85,
        prediction_horizon: "3 months",
        influencing_factors: [
          "Seasonal demand increase",
          "New equipment installation",
          "Market expansion",
        ],
        recommended_actions: [
          "Prepare additional storage capacity",
          "Schedule equipment maintenance",
          "Increase workforce during peak periods",
        ],
        risk_level: "low",
      },
      {
        metric: "Berth Utilization",
        current_value: 75,
        predicted_value: 82,
        confidence_level: 0.78,
        prediction_horizon: "2 months",
        influencing_factors: [
          "Increased vessel traffic",
          "Improved scheduling efficiency",
        ],
        recommended_actions: [
          "Optimize berth allocation algorithms",
          "Consider additional berth capacity",
          "Improve vessel scheduling coordination",
        ],
        risk_level: "medium",
      },
      {
        metric: "Energy Consumption",
        current_value: 450000,
        predicted_value: 485000,
        confidence_level: 0.72,
        prediction_horizon: "6 months",
        influencing_factors: [
          "Increased operations",
          "Seasonal temperature changes",
        ],
        recommended_actions: [
          "Implement energy efficiency measures",
          "Consider renewable energy sources",
          "Optimize equipment operation schedules",
        ],
        risk_level: "high",
      },
    ];

    const generateKPITrends = (): KPITrend[] => {
      const trends = [];
      const baseDate = new Date("2023-07-01");

      for (let i = 0; i < 6; i++) {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() + i);

        trends.push({
          date: date.toISOString().slice(0, 7),
          throughput: 100000 + i * 4000 + Math.random() * 8000,
          efficiency: 75 + i * 1.5 + Math.random() * 5,
          utilization: 65 + i * 1.8 + Math.random() * 6,
          revenue: 1800000 + i * 120000 + Math.random() * 150000,
          turnaround: 24 - i * 0.8 + Math.random() * 2,
          otif: 85 + i * 1.2 + Math.random() * 4,
        });
      }

      return trends;
    };

    // Initial data
    setPerformanceMetrics(generatePerformanceMetrics());
    setBenchmarkData(generateBenchmarkData());
    setPredictiveAnalytics(generatePredictiveAnalytics());
    setKpiTrends(generateKPITrends());

    // Update every 5 minutes
    const interval = setInterval(() => {
      setPerformanceMetrics(generatePerformanceMetrics());

      // Update predictive analytics with small variations
      setPredictiveAnalytics((prev) =>
        prev.map((prediction) => ({
          ...prediction,
          predicted_value:
            prediction.predicted_value +
            (Math.random() - 0.5) * prediction.predicted_value * 0.02,
          confidence_level: Math.max(
            0.6,
            Math.min(
              0.95,
              prediction.confidence_level + (Math.random() - 0.5) * 0.05
            )
          ),
        }))
      );
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "📊";
    }
  };

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

  const getPerformanceColor = (
    current: number,
    target: number,
    isReverse = false
  ) => {
    const ratio = current / target;
    if (isReverse) {
      // For metrics where lower is better (e.g., turnaround time, cost)
      if (ratio <= 0.9) return "text-green-600";
      if (ratio <= 1.1) return "text-yellow-600";
      return "text-red-600";
    } else {
      // For metrics where higher is better
      if (ratio >= 0.9) return "text-green-600";
      if (ratio >= 0.8) return "text-yellow-600";
      return "text-red-600";
    }
  };

  const currentMetrics = performanceMetrics[0] || {
    period: "Current",
    throughput: 0,
    berth_utilization: 0,
    vessel_turnaround: 0,
    loading_efficiency: 0,
    otif_performance: 0,
    revenue: 0,
    cost_per_ton: 0,
    energy_consumption: 0,
    safety_incidents: 0,
    customer_satisfaction: 0,
  };

  // Chart data
  const benchmarkChartData = benchmarkData.map((item) => ({
    metric: item.metric.split(" ")[0],
    current: item.current_value,
    target: item.target_value,
    industry: item.industry_average,
    best: item.best_practice,
  }));

  const performanceTrendData = performanceMetrics
    .slice()
    .reverse()
    .map((metric, index) => ({
      period: metric.period.split(" ")[0],
      throughput: metric.throughput / 1000,
      efficiency: metric.loading_efficiency,
      utilization: metric.berth_utilization,
      otif: metric.otif_performance,
    }));

  const costAnalysisData = performanceMetrics
    .slice()
    .reverse()
    .map((metric) => ({
      period: metric.period.split(" ")[0],
      revenue: metric.revenue / 1000,
      cost_per_ton: metric.cost_per_ton,
      energy_cost: (metric.energy_consumption * 0.12) / 1000, // Assuming $0.12/kWh
    }));

  const predictionData = predictiveAnalytics.map((prediction) => ({
    metric: prediction.metric.split(" ")[0],
    current: prediction.current_value,
    predicted: prediction.predicted_value,
    confidence: prediction.confidence_level * 100,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Port Analytics
          </h2>
          <p className="text-gray-600">
            Advanced analytics and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          {["daily", "weekly", "monthly", "yearly"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period as any)}
              className={
                selectedPeriod === period ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Throughput</p>
            <p className="text-2xl font-bold text-gray-900">
              {(currentMetrics.throughput / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-500">tons/month</p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                📈 +8.5%
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Berth Utilization</p>
            <p className="text-2xl font-bold text-blue-600">
              {currentMetrics.berth_utilization.toFixed(0)}%
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                📈 +4.2%
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Turnaround Time</p>
            <p className="text-2xl font-bold text-yellow-600">
              {currentMetrics.vessel_turnaround.toFixed(0)}h
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                📉 -2.1h
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Loading Efficiency</p>
            <p className="text-2xl font-bold text-green-600">
              {currentMetrics.loading_efficiency.toFixed(0)}%
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                📈 +3.8%
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">OTIF Performance</p>
            <p className="text-2xl font-bold text-purple-600">
              {currentMetrics.otif_performance.toFixed(0)}%
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                📈 +3.1%
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-red-600">
              ${(currentMetrics.revenue / 1000000).toFixed(1)}M
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-red-50 text-red-700">
                📈 +12.3%
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Trends and Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="throughput"
                stroke="#dc2626"
                name="Throughput (K tons)"
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3b82f6"
                name="Efficiency %"
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#10b981"
                name="Utilization %"
              />
              <Line
                type="monotone"
                dataKey="otif"
                stroke="#8b5cf6"
                name="OTIF %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Benchmark Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Benchmark Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarkChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#dc2626" name="Current" />
              <Bar dataKey="target" fill="#fca5a5" name="Target" />
              <Bar dataKey="industry" fill="#6b7280" name="Industry Avg" />
              <Bar dataKey="best" fill="#10b981" name="Best Practice" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Benchmark Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Detailed Benchmark Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Metric</th>
                <th className="text-left py-3 px-4">Current</th>
                <th className="text-left py-3 px-4">Target</th>
                <th className="text-left py-3 px-4">Industry Avg</th>
                <th className="text-left py-3 px-4">Best Practice</th>
                <th className="text-left py-3 px-4">Trend</th>
                <th className="text-left py-3 px-4">Improvement Potential</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium">{item.metric}</td>
                  <td
                    className={`py-3 px-4 font-bold ${getPerformanceColor(
                      item.current_value,
                      item.target_value,
                      item.metric.includes("Turnaround") ||
                        item.metric.includes("Cost")
                    )}`}
                  >
                    {item.current_value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {item.target_value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {item.industry_average.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-green-600">
                    {item.best_practice.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-lg">{getTrendIcon(item.trend)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {item.improvement_potential.toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Predictive Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Predictive Analytics
        </h3>
        <div className="space-y-6">
          {predictiveAnalytics.map((prediction, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {prediction.metric}
                    </h4>
                    <Badge className={getRiskColor(prediction.risk_level)}>
                      {prediction.risk_level} risk
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {(prediction.confidence_level * 100).toFixed(0)}%
                      confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Prediction horizon: {prediction.prediction_horizon}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current → Predicted</p>
                  <p className="text-lg font-bold">
                    <span className="text-gray-900">
                      {prediction.current_value.toLocaleString()}
                    </span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span
                      className={
                        prediction.predicted_value > prediction.current_value
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {prediction.predicted_value.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {(
                      ((prediction.predicted_value - prediction.current_value) /
                        prediction.current_value) *
                      100
                    ).toFixed(1)}
                    % change
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Influencing Factors
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {prediction.influencing_factors.map((factor, i) => (
                      <li key={i}>• {factor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Recommended Actions
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {prediction.recommended_actions.map((action, i) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cost Analysis and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Financial Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={costAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#dc2626"
                fill="#fef2f2"
                name="Revenue ($K)"
              />
              <Line
                type="monotone"
                dataKey="cost_per_ton"
                stroke="#f59e0b"
                name="Cost per Ton ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Prediction Accuracy
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="current" name="Current Value" />
              <YAxis dataKey="predicted" name="Predicted Value" />
              <Tooltip />
              <Scatter
                dataKey="confidence"
                fill="#dc2626"
                name="Confidence %"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🤖 AI-Generated Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                📊 Performance Opportunity
              </h4>
              <p className="text-sm text-gray-600">
                Optimizing berth scheduling could increase utilization by 12%
                and reduce vessel waiting time by 3.2 hours on average.
              </p>
              <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                View Recommendations
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                ⚡ Energy Efficiency
              </h4>
              <p className="text-sm text-gray-600">
                Implementing smart load balancing could reduce energy
                consumption by 15% during off-peak hours.
              </p>
              <Button
                size="sm"
                className="mt-2 bg-green-600 hover:bg-green-700"
              >
                Explore Solutions
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🎯 Market Forecast
              </h4>
              <p className="text-sm text-gray-600">
                Demand is expected to increase by 18% in Q2 2024. Consider
                expanding capacity or optimizing current operations.
              </p>
              <Button
                size="sm"
                className="mt-2 bg-purple-600 hover:bg-purple-700"
              >
                Strategic Planning
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                💰 Cost Optimization
              </h4>
              <p className="text-sm text-gray-600">
                Predictive maintenance could reduce equipment downtime by 25%
                and save $180K annually.
              </p>
              <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                Implementation Plan
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PortAnalytics;
