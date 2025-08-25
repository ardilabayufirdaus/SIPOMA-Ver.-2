"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Factory,
  TrendingUp,
  Activity,
} from "lucide-react";

interface CCRDataEntry {
  id: string;
  timestamp: string;
  shift: "Shift 1" | "Shift 2" | "Shift 3";
  mill: string;
  rawMixType: string;
  cementType: string;
  productionRate: number;
  clinkerConsumption: number;
  gypsumConsumption: number;
  limestoneConsumption: number;
  flyAshConsumption: number;
  operatorName: string;
  supervisorName: string;
  remarks: string;
  status: "draft" | "submitted" | "approved";
}

interface MillParameter {
  parameter: string;
  value: number;
  unit: string;
  target: number;
  status: "normal" | "warning" | "critical";
}

const mockMillParameters: MillParameter[] = [
  {
    parameter: "Mill Load",
    value: 85,
    unit: "%",
    target: 85,
    status: "normal",
  },
  {
    parameter: "Mill Pressure",
    value: 2.3,
    unit: "bar",
    target: 2.5,
    status: "normal",
  },
  {
    parameter: "Mill Temperature",
    value: 95,
    unit: "°C",
    target: 100,
    status: "normal",
  },
  {
    parameter: "Separator Speed",
    value: 750,
    unit: "rpm",
    target: 750,
    status: "normal",
  },
  {
    parameter: "Feed Rate",
    value: 120,
    unit: "t/h",
    target: 125,
    status: "warning",
  },
  {
    parameter: "Power Consumption",
    value: 4200,
    unit: "kW",
    target: 4000,
    status: "warning",
  },
  {
    parameter: "Vibration X",
    value: 2.1,
    unit: "mm/s",
    target: 2.5,
    status: "normal",
  },
  {
    parameter: "Vibration Y",
    value: 1.8,
    unit: "mm/s",
    target: 2.5,
    status: "normal",
  },
];

export default function CCRDataEntry() {
  const [currentShift, setCurrentShift] = useState<
    "Shift 1" | "Shift 2" | "Shift 3"
  >("Shift 1");
  const [selectedMill, setSelectedMill] = useState("Cement Mill #1");
  const [formData, setFormData] = useState<Partial<CCRDataEntry>>({
    shift: currentShift,
    mill: selectedMill,
    rawMixType: "Standard Mix",
    cementType: "OPC",
    productionRate: 0,
    clinkerConsumption: 0,
    gypsumConsumption: 0,
    limestoneConsumption: 0,
    flyAshConsumption: 0,
    operatorName: "",
    supervisorName: "",
    remarks: "",
    status: "draft",
  });

  const [millParameters, setMillParameters] =
    useState<MillParameter[]>(mockMillParameters);

  useEffect(() => {
    // Determine current shift based on time
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) {
      setCurrentShift("Shift 1");
    } else if (hour >= 14 && hour < 22) {
      setCurrentShift("Shift 2");
    } else {
      setCurrentShift("Shift 3");
    }

    // Simulate real-time parameter updates
    const interval = setInterval(() => {
      setMillParameters((prev) =>
        prev.map((param) => ({
          ...param,
          value: param.value + (Math.random() - 0.5) * (param.value * 0.05),
          status:
            Math.random() > 0.1
              ? param.status
              : Math.random() > 0.7
              ? "warning"
              : Math.random() > 0.95
              ? "critical"
              : "normal",
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // Implement save draft logic
  };

  const handleSubmit = () => {
    console.log("Submitting data:", formData);
    // Implement submit logic
  };

  const getParameterStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getParameterIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const millOptions = [
    "Cement Mill #1",
    "Cement Mill #2",
    "Raw Mill #1",
    "Raw Mill #2",
  ];
  const rawMixTypes = [
    "Standard Mix",
    "High Strength Mix",
    "Low Heat Mix",
    "Sulfate Resistant Mix",
  ];
  const cementTypes = ["OPC", "PPC", "PSC", "SRC"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Factory className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CCR Data Entry</h2>
            <p className="text-gray-600">Real-time operational data input</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {currentShift}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Entry Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Data Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mill Unit
                  </label>
                  <select
                    value={formData.mill}
                    onChange={(e) => handleInputChange("mill", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {millOptions.map((mill) => (
                      <option key={mill} value={mill}>
                        {mill}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => handleInputChange("shift", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="Shift 1">Shift 1 (06:00 - 14:00)</option>
                    <option value="Shift 2">Shift 2 (14:00 - 22:00)</option>
                    <option value="Shift 3">Shift 3 (22:00 - 06:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raw Mix Type
                  </label>
                  <select
                    value={formData.rawMixType}
                    onChange={(e) =>
                      handleInputChange("rawMixType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {rawMixTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cement Type
                  </label>
                  <select
                    value={formData.cementType}
                    onChange={(e) =>
                      handleInputChange("cementType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {cementTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Production Data */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Production Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Production Rate (t/h)
                    </label>
                    <input
                      type="number"
                      value={formData.productionRate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "productionRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinker Consumption (t/h)
                    </label>
                    <input
                      type="number"
                      value={formData.clinkerConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "clinkerConsumption",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gypsum Consumption (t/h)
                    </label>
                    <input
                      type="number"
                      value={formData.gypsumConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "gypsumConsumption",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limestone Consumption (t/h)
                    </label>
                    <input
                      type="number"
                      value={formData.limestoneConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "limestoneConsumption",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="0.0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fly Ash Consumption (t/h)
                    </label>
                    <input
                      type="number"
                      value={formData.flyAshConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "flyAshConsumption",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Personnel Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Personnel
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operator Name
                    </label>
                    <input
                      type="text"
                      value={formData.operatorName || ""}
                      onChange={(e) =>
                        handleInputChange("operatorName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Enter operator name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supervisor Name
                    </label>
                    <input
                      type="text"
                      value={formData.supervisorName || ""}
                      onChange={(e) =>
                        handleInputChange("supervisorName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Enter supervisor name"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks || ""}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter any remarks or notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Submit Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Parameters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                Live Mill Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {millParameters.map((param, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 rounded-full ${getParameterStatusColor(
                          param.status
                        )}`}
                      >
                        {getParameterIcon(param.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {param.parameter}
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {param.target} {param.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {param.value.toFixed(1)} {param.unit}
                      </p>
                      <Badge
                        variant="outline"
                        className={getParameterStatusColor(param.status)}
                      >
                        {param.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Total Production
                  </span>
                  <span className="text-sm font-medium">2,450 tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Entries Completed
                  </span>
                  <span className="text-sm font-medium">18 / 24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Efficiency</span>
                  <span className="text-sm font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Alerts</span>
                  <span className="text-sm font-medium text-red-600">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
