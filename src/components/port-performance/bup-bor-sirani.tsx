"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BupData {
  id: string;
  vessel_name: string;
  date: string;
  bup_number: string;
  cargo_description: string;
  quantity_bl: number;
  quantity_received: number;
  quantity_variance: number;
  status: "pending" | "in_progress" | "completed" | "discrepancy";
  inspector: string;
  surveyor: string;
  temperature: number;
  moisture_content: number;
  contamination_level: number;
  quality_grade: string;
  remarks: string;
}

interface BorData {
  id: string;
  vessel_name: string;
  date: string;
  bor_number: string;
  cargo_type: string;
  loading_commenced: string;
  loading_completed: string;
  quantity_loaded: number;
  loading_rate: number;
  weather_conditions: string;
  equipment_used: string[];
  delays: {
    weather: number;
    equipment: number;
    operational: number;
    other: number;
  };
  quality_certificates: string[];
  master_signature: boolean;
  agent_signature: boolean;
}

interface SiraniData {
  id: string;
  vessel_name: string;
  date: string;
  sirani_number: string;
  cargo_type: string;
  origin_port: string;
  destination_port: string;
  shipper: string;
  consignee: string;
  bill_of_lading: string;
  vessel_specifications: {
    dwt: number;
    length: number;
    beam: number;
    draft: number;
  };
  cargo_details: {
    total_quantity: number;
    number_of_holds: number;
    stowage_plan: string;
    segregation_requirements: string;
  };
  certificates: {
    class_certificate: boolean;
    insurance_certificate: boolean;
    cargo_manifest: boolean;
    health_certificate: boolean;
  };
}

const BupBorSirani = () => {
  const [bupData, setBupData] = useState<BupData[]>([]);
  const [borData, setBorData] = useState<BorData[]>([]);
  const [siraniData, setSiraniData] = useState<SiraniData[]>([]);
  const [activeTab, setActiveTab] = useState<"bup" | "bor" | "sirani">("bup");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  // Simulate real-time data updates
  useEffect(() => {
    const generateBupData = (): BupData[] => [
      {
        id: "bup-1",
        vessel_name: "MV Semen Nusantara",
        date: "2024-01-15",
        bup_number: "BUP-GRS-2024-001",
        cargo_description: "Portland Cement Type I",
        quantity_bl: 25000,
        quantity_received: 24950,
        quantity_variance: -50,
        status: "completed",
        inspector: "John Sembiring",
        surveyor: "PT Indo Survey",
        temperature: 45.5,
        moisture_content: 0.8,
        contamination_level: 0.2,
        quality_grade: "A",
        remarks:
          "Cargo in good condition, minor weight variance within acceptable limits",
      },
      {
        id: "bup-2",
        vessel_name: "MV Gresik Express",
        date: "2024-01-15",
        bup_number: "BUP-GRS-2024-002",
        cargo_description: "Cement Bags 50kg",
        quantity_bl: 18000,
        quantity_received: 17980,
        quantity_variance: -20,
        status: "in_progress",
        inspector: "Ahmad Wijaya",
        surveyor: "SGS Indonesia",
        temperature: 42.0,
        moisture_content: 1.2,
        contamination_level: 0.1,
        quality_grade: "A",
        remarks:
          "Unloading in progress, quality parameters within specification",
      },
      {
        id: "bup-3",
        vessel_name: "MV Jakarta Pioneer",
        date: "2024-01-15",
        bup_number: "BUP-GRS-2024-003",
        cargo_description: "Clinker",
        quantity_bl: 32000,
        quantity_received: 31800,
        quantity_variance: -200,
        status: "discrepancy",
        inspector: "Sari Dewi",
        surveyor: "Bureau Veritas",
        temperature: 48.2,
        moisture_content: 0.5,
        contamination_level: 0.8,
        quality_grade: "B",
        remarks:
          "Significant quantity variance detected, requires investigation",
      },
    ];

    const generateBorData = (): BorData[] => [
      {
        id: "bor-1",
        vessel_name: "MV Ocean Breeze",
        date: "2024-01-15",
        bor_number: "BOR-GRS-2024-001",
        cargo_type: "Cement Bulk",
        loading_commenced: "2024-01-15 08:00",
        loading_completed: "2024-01-15 18:00",
        quantity_loaded: 28000,
        loading_rate: 2800,
        weather_conditions: "Fair, Wind 12 kt NE",
        equipment_used: [
          "Ship Loader 1",
          "Conveyor Belt A",
          "Dust Suppression",
        ],
        delays: {
          weather: 0.5,
          equipment: 1.2,
          operational: 0.8,
          other: 0,
        },
        quality_certificates: [
          "Quality Certificate",
          "Weight Certificate",
          "Analysis Report",
        ],
        master_signature: true,
        agent_signature: true,
      },
      {
        id: "bor-2",
        vessel_name: "MV Surabaya Star",
        date: "2024-01-16",
        bor_number: "BOR-GRS-2024-002",
        cargo_type: "Cement Bags",
        loading_commenced: "2024-01-16 09:00",
        loading_completed: "2024-01-16 17:30",
        quantity_loaded: 22000,
        loading_rate: 2588,
        weather_conditions: "Cloudy, Wind 18 kt SE",
        equipment_used: ["Grab Crane", "Conveyor Belt B", "Mobile Crane"],
        delays: {
          weather: 1.5,
          equipment: 0,
          operational: 0.5,
          other: 0.5,
        },
        quality_certificates: ["Quality Certificate", "Weight Certificate"],
        master_signature: true,
        agent_signature: false,
      },
    ];

    const generateSiraniData = (): SiraniData[] => [
      {
        id: "sirani-1",
        vessel_name: "MV Global Trader",
        date: "2024-01-16",
        sirani_number: "SIRANI-GRS-2024-001",
        cargo_type: "Portland Cement",
        origin_port: "Gresik Port",
        destination_port: "Batam Port",
        shipper: "PT Semen Indonesia",
        consignee: "PT Batam Cement",
        bill_of_lading: "BL-SGI-2024-001",
        vessel_specifications: {
          dwt: 35000,
          length: 185,
          beam: 28,
          draft: 12.5,
        },
        cargo_details: {
          total_quantity: 30000,
          number_of_holds: 4,
          stowage_plan: "Even distribution across all holds",
          segregation_requirements: "None - homogeneous cargo",
        },
        certificates: {
          class_certificate: true,
          insurance_certificate: true,
          cargo_manifest: true,
          health_certificate: true,
        },
      },
      {
        id: "sirani-2",
        vessel_name: "MV Indonesia Pride",
        date: "2024-01-16",
        sirani_number: "SIRANI-GRS-2024-002",
        cargo_type: "Clinker",
        origin_port: "Gresik Port",
        destination_port: "Makassar Port",
        shipper: "PT Holcim Indonesia",
        consignee: "PT Makassar Cement",
        bill_of_lading: "BL-HCI-2024-002",
        vessel_specifications: {
          dwt: 42000,
          length: 195,
          beam: 32,
          draft: 14.0,
        },
        cargo_details: {
          total_quantity: 38000,
          number_of_holds: 5,
          stowage_plan: "Sequential loading - holds 1-5",
          segregation_requirements: "None - bulk cargo",
        },
        certificates: {
          class_certificate: true,
          insurance_certificate: true,
          cargo_manifest: true,
          health_certificate: false,
        },
      },
    ];

    // Initial data
    setBupData(generateBupData());
    setBorData(generateBorData());
    setSiraniData(generateSiraniData());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setBupData((prev) =>
        prev.map((record) => ({
          ...record,
          temperature: record.temperature + (Math.random() - 0.5) * 2,
          moisture_content: Math.max(
            0,
            record.moisture_content + (Math.random() - 0.5) * 0.2
          ),
          contamination_level: Math.max(
            0,
            record.contamination_level + (Math.random() - 0.5) * 0.1
          ),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "discrepancy":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-yellow-100 text-yellow-800";
      case "C":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chart data
  const qualityTrendData = bupData.map((record) => ({
    vessel: record.vessel_name.split(" ").slice(-1)[0],
    temperature: record.temperature,
    moisture: record.moisture_content,
    contamination: record.contamination_level,
  }));

  const varianceData = bupData.map((record) => ({
    vessel: record.vessel_name.split(" ").slice(-1)[0],
    variance: Math.abs(record.quantity_variance),
    percentage: (record.quantity_variance / record.quantity_bl) * 100,
  }));

  const delayAnalysisData = borData.flatMap((record) =>
    Object.entries(record.delays).map(([type, hours]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      hours: hours,
      vessel: record.vessel_name.split(" ").slice(-1)[0],
    }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            BUP/BOR/SIRANI Database
          </h2>
          <p className="text-gray-600">
            Comprehensive cargo documentation system
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">+ New Record</Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              id: "bup",
              label: "BUP (Berita Unloading Port)",
              count: bupData.length,
            },
            {
              id: "bor",
              label: "BOR (Berita Oper Ruang)",
              count: borData.length,
            },
            {
              id: "sirani",
              label: "SIRANI (Surat Izin Angkut)",
              count: siraniData.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {bupData.length + borData.length + siraniData.length}
              </p>
            </div>
            <span className="text-2xl">📋</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {bupData.filter((r) => r.status === "in_progress").length}
              </p>
            </div>
            <span className="text-2xl">⏳</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {bupData.filter((r) => r.status === "completed").length +
                  borData.length}
              </p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Discrepancies</p>
              <p className="text-2xl font-bold text-red-600">
                {bupData.filter((r) => r.status === "discrepancy").length}
              </p>
            </div>
            <span className="text-2xl">⚠️</span>
          </div>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === "bup" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BUP Records List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  BUP Records
                </h3>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  + Create BUP
                </Button>
              </div>

              <div className="space-y-4">
                {bupData.map((record) => (
                  <div
                    key={record.id}
                    className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-100 ${
                      selectedRecord === record.id
                        ? "ring-2 ring-red-500 bg-red-50"
                        : ""
                    }`}
                    onClick={() => setSelectedRecord(record.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {record.vessel_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {record.bup_number}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getQualityColor(record.quality_grade)}
                        >
                          Grade {record.quality_grade}
                        </Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Cargo</p>
                        <p className="text-sm font-medium">
                          {record.cargo_description}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Inspector</p>
                        <p className="text-sm font-medium">
                          {record.inspector}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Surveyor</p>
                        <p className="text-sm font-medium">{record.surveyor}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">B/L Qty:</span>
                        <span className="ml-2 font-medium">
                          {record.quantity_bl.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Received:</span>
                        <span className="ml-2 font-medium">
                          {record.quantity_received.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Variance:</span>
                        <span
                          className={`ml-2 font-medium ${
                            record.quantity_variance < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {record.quantity_variance > 0 ? "+" : ""}
                          {record.quantity_variance}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Temp:</span>
                        <span className="ml-2">
                          {record.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Moisture:</span>
                        <span className="ml-2">
                          {record.moisture_content.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Contamination:</span>
                        <span className="ml-2">
                          {record.contamination_level.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {record.remarks && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Remarks:</strong> {record.remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quality Analysis Charts */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quality Parameters
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={qualityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vessel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#dc2626"
                    name="Temp (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="#3b82f6"
                    name="Moisture (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="contamination"
                    stroke="#f59e0b"
                    name="Contamination (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quantity Variance
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={varianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vessel" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="variance"
                    fill="#dc2626"
                    name="Variance (tons)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "bor" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                BOR Records
              </h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                + Create BOR
              </Button>
            </div>

            <div className="space-y-4">
              {borData.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {record.vessel_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {record.bor_number}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {record.quantity_loaded.toLocaleString()} tons
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {record.loading_rate} TPH
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Cargo Type</p>
                      <p className="text-sm font-medium">{record.cargo_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loading Started</p>
                      <p className="text-sm font-medium">
                        {record.loading_commenced}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loading Completed</p>
                      <p className="text-sm font-medium">
                        {record.loading_completed}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Weather</p>
                      <p className="text-sm font-medium">
                        {record.weather_conditions}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Equipment Used</p>
                    <div className="flex flex-wrap gap-1">
                      {record.equipment_used.map((equipment, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Weather Delay</p>
                      <p className="text-sm font-medium">
                        {record.delays.weather}h
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Equipment Delay</p>
                      <p className="text-sm font-medium">
                        {record.delays.equipment}h
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Operational Delay</p>
                      <p className="text-sm font-medium">
                        {record.delays.operational}h
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Other Delay</p>
                      <p className="text-sm font-medium">
                        {record.delays.other}h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span
                          className={
                            record.master_signature
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {record.master_signature ? "✓" : "✗"}
                        </span>
                        <span className="ml-1 text-sm">Master Signed</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={
                            record.agent_signature
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {record.agent_signature ? "✓" : "✗"}
                        </span>
                        <span className="ml-1 text-sm">Agent Signed</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {record.quality_certificates.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delay Analysis Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delay Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={delayAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#dc2626" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === "sirani" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                SIRANI Records
              </h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                + Create SIRANI
              </Button>
            </div>

            <div className="space-y-6">
              {siraniData.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {record.vessel_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {record.sirani_number}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {record.cargo_details.total_quantity.toLocaleString()}{" "}
                      tons
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Route Information
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">Origin:</span>
                          <span className="ml-2">{record.origin_port}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Destination:</span>
                          <span className="ml-2">
                            {record.destination_port}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cargo:</span>
                          <span className="ml-2">{record.cargo_type}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Parties
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">Shipper:</span>
                          <span className="ml-2">{record.shipper}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Consignee:</span>
                          <span className="ml-2">{record.consignee}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">B/L Number:</span>
                          <span className="ml-2">{record.bill_of_lading}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Vessel Specs
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">DWT:</span>
                          <span className="ml-2">
                            {record.vessel_specifications.dwt.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Length:</span>
                          <span className="ml-2">
                            {record.vessel_specifications.length}m
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Beam:</span>
                          <span className="ml-2">
                            {record.vessel_specifications.beam}m
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Draft:</span>
                          <span className="ml-2">
                            {record.vessel_specifications.draft}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Cargo Details
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">Total Quantity:</span>
                          <span className="ml-2">
                            {record.cargo_details.total_quantity.toLocaleString()}{" "}
                            tons
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Number of Holds:
                          </span>
                          <span className="ml-2">
                            {record.cargo_details.number_of_holds}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stowage Plan:</span>
                          <span className="ml-2">
                            {record.cargo_details.stowage_plan}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Segregation:</span>
                          <span className="ml-2">
                            {record.cargo_details.segregation_requirements}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Certificates
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(record.certificates).map(
                          ([cert, available]) => (
                            <div
                              key={cert}
                              className="flex items-center text-sm"
                            >
                              <span
                                className={
                                  available ? "text-green-600" : "text-red-600"
                                }
                              >
                                {available ? "✓" : "✗"}
                              </span>
                              <span className="ml-2 capitalize">
                                {cert.replace("_", " ")}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BupBorSirani;
