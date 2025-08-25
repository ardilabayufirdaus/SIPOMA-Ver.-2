"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Target,
  Beaker,
  Microscope,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";

interface QualityParameter {
  id: string;
  name: string;
  value: number;
  target: number;
  tolerance: { min: number; max: number };
  unit: string;
  status: "pass" | "warning" | "fail";
  testMethod: string;
  frequency: string;
  lastTested: string;
  trend: "up" | "down" | "stable";
}

interface QualityTest {
  id: string;
  sampleId: string;
  timestamp: string;
  cementType: string;
  batchNumber: string;
  testType: "chemical" | "physical" | "durability";
  operator: string;
  results: QualityParameter[];
  status: "pending" | "in-progress" | "completed" | "failed";
  compliance: number;
}

interface QualityTrend {
  date: string;
  compressiveStrength: number;
  blaine: number;
  lsf: number;
  c3s: number;
  so3: number;
}

const mockQualityParameters: QualityParameter[] = [
  {
    id: "qp_001",
    name: "Compressive Strength (7 days)",
    value: 42.5,
    target: 43.0,
    tolerance: { min: 41.0, max: 45.0 },
    unit: "MPa",
    status: "pass",
    testMethod: "ASTM C109",
    frequency: "Every 2 hours",
    lastTested: "30 minutes ago",
    trend: "stable",
  },
  {
    id: "qp_002",
    name: "Blaine Fineness",
    value: 3850,
    target: 3800,
    tolerance: { min: 3600, max: 4000 },
    unit: "cm²/g",
    status: "pass",
    testMethod: "ASTM C204",
    frequency: "Every hour",
    lastTested: "15 minutes ago",
    trend: "up",
  },
  {
    id: "qp_003",
    name: "LSF (Lime Saturation Factor)",
    value: 94.2,
    target: 95.0,
    tolerance: { min: 92.0, max: 98.0 },
    unit: "%",
    status: "pass",
    testMethod: "XRF Analysis",
    frequency: "Every hour",
    lastTested: "10 minutes ago",
    trend: "down",
  },
  {
    id: "qp_004",
    name: "C3S Content",
    value: 58.2,
    target: 60.0,
    tolerance: { min: 55.0, max: 65.0 },
    unit: "%",
    status: "warning",
    testMethod: "XRD Analysis",
    frequency: "Every 4 hours",
    lastTested: "2 hours ago",
    trend: "down",
  },
  {
    id: "qp_005",
    name: "SO3 Content",
    value: 3.2,
    target: 3.0,
    tolerance: { min: 2.5, max: 3.5 },
    unit: "%",
    status: "pass",
    testMethod: "XRF Analysis",
    frequency: "Every 2 hours",
    lastTested: "1 hour ago",
    trend: "up",
  },
  {
    id: "qp_006",
    name: "Setting Time (Initial)",
    value: 145,
    target: 150,
    tolerance: { min: 45, max: 180 },
    unit: "minutes",
    status: "pass",
    testMethod: "ASTM C191",
    frequency: "Every 4 hours",
    lastTested: "3 hours ago",
    trend: "stable",
  },
];

const mockQualityTests: QualityTest[] = [
  {
    id: "qt_001",
    sampleId: "OPC-240115-001",
    timestamp: "2024-01-15T10:30:00Z",
    cementType: "OPC Grade 43",
    batchNumber: "B240115-01",
    testType: "chemical",
    operator: "Dr. Sarah Johnson",
    results: mockQualityParameters.slice(2, 5),
    status: "completed",
    compliance: 95.2,
  },
  {
    id: "qt_002",
    sampleId: "OPC-240115-002",
    timestamp: "2024-01-15T12:00:00Z",
    cementType: "OPC Grade 43",
    batchNumber: "B240115-02",
    testType: "physical",
    operator: "John Smith",
    results: mockQualityParameters.slice(0, 3),
    status: "in-progress",
    compliance: 92.8,
  },
  {
    id: "qt_003",
    sampleId: "OPC-240115-003",
    timestamp: "2024-01-15T14:00:00Z",
    cementType: "OPC Grade 53",
    batchNumber: "B240115-03",
    testType: "durability",
    operator: "Dr. Sarah Johnson",
    results: [],
    status: "pending",
    compliance: 0,
  },
];

const mockQualityTrend: QualityTrend[] = [
  {
    date: "2024-01-10",
    compressiveStrength: 41.8,
    blaine: 3820,
    lsf: 94.5,
    c3s: 59.2,
    so3: 2.9,
  },
  {
    date: "2024-01-11",
    compressiveStrength: 42.1,
    blaine: 3840,
    lsf: 94.3,
    c3s: 58.8,
    so3: 3.0,
  },
  {
    date: "2024-01-12",
    compressiveStrength: 42.3,
    blaine: 3835,
    lsf: 94.1,
    c3s: 58.5,
    so3: 3.1,
  },
  {
    date: "2024-01-13",
    compressiveStrength: 42.0,
    blaine: 3860,
    lsf: 94.0,
    c3s: 58.3,
    so3: 3.2,
  },
  {
    date: "2024-01-14",
    compressiveStrength: 42.4,
    blaine: 3845,
    lsf: 94.2,
    c3s: 58.1,
    so3: 3.1,
  },
  {
    date: "2024-01-15",
    compressiveStrength: 42.5,
    blaine: 3850,
    lsf: 94.2,
    c3s: 58.2,
    so3: 3.2,
  },
];

const radarData = [
  { parameter: "Compressive Strength", value: 95, fullMark: 100 },
  { parameter: "Fineness", value: 98, fullMark: 100 },
  { parameter: "LSF", value: 96, fullMark: 100 },
  { parameter: "C3S", value: 87, fullMark: 100 },
  { parameter: "SO3", value: 91, fullMark: 100 },
  { parameter: "Setting Time", value: 93, fullMark: 100 },
];

export default function QualityControl() {
  const [parameters, setParameters] = useState<QualityParameter[]>(
    mockQualityParameters
  );
  const [tests, setTests] = useState<QualityTest[]>(mockQualityTests);
  const [selectedParameter, setSelectedParameter] =
    useState<QualityParameter | null>(null);

  useEffect(() => {
    // Simulate real-time parameter updates
    const interval = setInterval(() => {
      setParameters((prev) =>
        prev.map((param) => {
          const variation = (Math.random() - 0.5) * 0.1;
          const newValue = param.value + variation;
          const isWithinTolerance =
            newValue >= param.tolerance.min && newValue <= param.tolerance.max;
          const isNearTarget =
            Math.abs(newValue - param.target) / param.target < 0.05;

          return {
            ...param,
            value: newValue,
            status: !isWithinTolerance
              ? "fail"
              : !isNearTarget
              ? "warning"
              : "pass",
            trend:
              variation > 0.05 ? "up" : variation < -0.05 ? "down" : "stable",
            lastTested: "Just now",
          };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "fail":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "fail":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case "stable":
        return <Target className="h-4 w-4 text-green-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const passCount = parameters.filter((p) => p.status === "pass").length;
  const warningCount = parameters.filter((p) => p.status === "warning").length;
  const failCount = parameters.filter((p) => p.status === "fail").length;
  const overallCompliance = (passCount / parameters.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{passCount}</p>
              <p className="text-sm text-gray-600">Parameters Passing</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
              <p className="text-sm text-gray-600">Parameters Warning</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{failCount}</p>
              <p className="text-sm text-gray-600">Parameters Failed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {overallCompliance.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Overall Compliance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parameters List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Quality Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parameters.map((param) => (
                  <div
                    key={param.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedParameter?.id === param.id
                        ? "ring-2 ring-red-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() =>
                      setSelectedParameter(
                        selectedParameter?.id === param.id ? null : param
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Microscope className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {param.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {param.testMethod}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(param.trend)}
                        <Badge
                          className={`${getStatusColor(
                            param.status
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(param.status)}
                          {param.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Current</p>
                        <p className="font-medium">
                          {param.value.toFixed(1)} {param.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Target</p>
                        <p className="font-medium">
                          {param.target.toFixed(1)} {param.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tolerance</p>
                        <p className="font-medium">
                          {param.tolerance.min} - {param.tolerance.max}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Frequency</p>
                        <p className="font-medium">{param.frequency}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            param.status === "pass"
                              ? "bg-green-600"
                              : param.status === "warning"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{
                            width: `${
                              ((param.value - param.tolerance.min) /
                                (param.tolerance.max - param.tolerance.min)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 text-right">
                      Last tested: {param.lastTested}
                    </div>

                    {selectedParameter?.id === param.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            View History
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Set Limits
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Retest
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Trends - Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockQualityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="compressiveStrength"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Compressive Strength (MPa)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="blaine"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Blaine (cm²/g)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="lsf"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="LSF (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Recent Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Sample: {test.sampleId}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {test.cementType} | Batch: {test.batchNumber}
                        </p>
                      </div>
                      <Badge className={getTestStatusColor(test.status)}>
                        {test.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Test Type</p>
                        <p className="font-medium capitalize">
                          {test.testType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Operator</p>
                        <p className="font-medium">{test.operator}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Compliance</p>
                        <p
                          className={`font-medium ${
                            test.compliance >= 95
                              ? "text-green-600"
                              : test.compliance >= 85
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {test.compliance.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {new Date(test.timestamp).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Dashboard */}
        <div className="space-y-6">
          {/* Quality Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="parameter" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                  <Radar
                    name="Quality Score"
                    dataKey="value"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Compliance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today's Tests</span>
                  <span className="font-medium">{tests.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tests Passed</span>
                  <span className="font-medium text-green-600">
                    {tests.filter((t) => t.compliance >= 90).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Average Compliance
                  </span>
                  <span className="font-medium">
                    {(
                      tests.reduce((sum, t) => sum + t.compliance, 0) /
                      tests.length
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quality Rating</span>
                  <Badge className="bg-green-100 text-green-800">
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Generate QC Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Test
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Beaker className="h-4 w-4" />
                Sample Management
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <ClipboardCheck className="h-4 w-4" />
                Calibration Due
              </Button>
            </CardContent>
          </Card>

          {/* Quality Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">
                    C3S Content Low
                  </p>
                  <p className="text-sm text-yellow-700">
                    Current: 58.2% | Target: 60% | Review raw mix composition
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Calibration Due
                  </p>
                  <p className="text-sm text-blue-700">
                    XRF analyzer calibration due in 2 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
