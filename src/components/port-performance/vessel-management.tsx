"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Vessel {
  id: string;
  name: string;
  type: string;
  status: "berthed" | "anchored" | "approaching" | "departing" | "at_sea";
  cargo: string;
  tonnage: number;
  eta: string;
  etd?: string;
  berth?: string;
  captain: string;
  flag: string;
  length: number;
  beam: number;
  draft: number;
  grt: number;
  dwt: number;
  current_position: {
    lat: number;
    lng: number;
    speed: number;
    heading: number;
  };
  voyage_info: {
    origin: string;
    destination: string;
    charter_party: string;
    agent: string;
  };
  documents: {
    customs_clearance: boolean;
    port_clearance: boolean;
    cargo_manifest: boolean;
    bills_of_lading: boolean;
  };
  services: {
    pilotage: boolean;
    tugboat: boolean;
    linesmen: boolean;
    bunker: boolean;
  };
  progress: number;
  loading_efficiency: number;
  delays: number;
}

const VesselManagement = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate real-time data updates
  useEffect(() => {
    const generateVessels = (): Vessel[] => [
      {
        id: "vessel-1",
        name: "MV Semen Nusantara",
        type: "Bulk Carrier",
        status: "berthed",
        cargo: "Cement Bulk",
        tonnage: 25000,
        eta: "2024-01-15 08:00",
        etd: "2024-01-15 20:00",
        berth: "Berth 1",
        captain: "Capt. Ahmad Wijaya",
        flag: "Indonesia",
        length: 180,
        beam: 28,
        draft: 12.5,
        grt: 15000,
        dwt: 32000,
        current_position: {
          lat: -7.2575,
          lng: 112.7521,
          speed: 0,
          heading: 90,
        },
        voyage_info: {
          origin: "Gresik Port",
          destination: "Jakarta Port",
          charter_party: "PT Semen Indonesia",
          agent: "Maritime Agency Co.",
        },
        documents: {
          customs_clearance: true,
          port_clearance: true,
          cargo_manifest: true,
          bills_of_lading: true,
        },
        services: {
          pilotage: true,
          tugboat: true,
          linesmen: true,
          bunker: false,
        },
        progress: 65 + Math.random() * 20,
        loading_efficiency: 85 + Math.random() * 10,
        delays: 2,
      },
      {
        id: "vessel-2",
        name: "MV Gresik Express",
        type: "General Cargo",
        status: "berthed",
        cargo: "Cement Bags",
        tonnage: 18000,
        eta: "2024-01-15 14:00",
        etd: "2024-01-16 06:00",
        berth: "Berth 2",
        captain: "Capt. Budi Santoso",
        flag: "Indonesia",
        length: 165,
        beam: 25,
        draft: 10.8,
        grt: 12000,
        dwt: 24000,
        current_position: {
          lat: -7.258,
          lng: 112.7525,
          speed: 0,
          heading: 180,
        },
        voyage_info: {
          origin: "Surabaya Port",
          destination: "Makassar Port",
          charter_party: "PT Holcim Indonesia",
          agent: "Surabaya Shipping Lines",
        },
        documents: {
          customs_clearance: true,
          port_clearance: true,
          cargo_manifest: true,
          bills_of_lading: false,
        },
        services: {
          pilotage: true,
          tugboat: false,
          linesmen: true,
          bunker: true,
        },
        progress: 40 + Math.random() * 25,
        loading_efficiency: 78 + Math.random() * 15,
        delays: 0,
      },
      {
        id: "vessel-3",
        name: "MV Jakarta Pioneer",
        type: "Bulk Carrier",
        status: "approaching",
        cargo: "Clinker",
        tonnage: 32000,
        eta: "2024-01-15 22:00",
        captain: "Capt. Sari Dewi",
        flag: "Singapore",
        length: 195,
        beam: 32,
        draft: 14.2,
        grt: 18000,
        dwt: 42000,
        current_position: {
          lat: -7.22,
          lng: 112.78,
          speed: 8.5,
          heading: 270,
        },
        voyage_info: {
          origin: "Bangkok Port",
          destination: "Gresik Port",
          charter_party: "PT Indocement",
          agent: "International Maritime Services",
        },
        documents: {
          customs_clearance: false,
          port_clearance: false,
          cargo_manifest: true,
          bills_of_lading: true,
        },
        services: {
          pilotage: false,
          tugboat: false,
          linesmen: false,
          bunker: false,
        },
        progress: 15 + Math.random() * 10,
        loading_efficiency: 0,
        delays: 0,
      },
      {
        id: "vessel-4",
        name: "MV Surabaya Star",
        type: "Container Ship",
        status: "anchored",
        cargo: "Cement Bags",
        tonnage: 22000,
        eta: "2024-01-16 08:00",
        captain: "Capt. Lisa Chen",
        flag: "Panama",
        length: 175,
        beam: 27,
        draft: 11.5,
        grt: 14000,
        dwt: 28000,
        current_position: {
          lat: -7.24,
          lng: 112.76,
          speed: 0,
          heading: 45,
        },
        voyage_info: {
          origin: "Singapore Port",
          destination: "Semarang Port",
          charter_party: "PT Lafarge Cement",
          agent: "Pacific Maritime Agency",
        },
        documents: {
          customs_clearance: true,
          port_clearance: false,
          cargo_manifest: true,
          bills_of_lading: true,
        },
        services: {
          pilotage: false,
          tugboat: false,
          linesmen: false,
          bunker: true,
        },
        progress: 0,
        loading_efficiency: 0,
        delays: 3,
      },
      {
        id: "vessel-5",
        name: "MV Ocean Breeze",
        type: "Bulk Carrier",
        status: "at_sea",
        cargo: "Cement Bulk",
        tonnage: 28000,
        eta: "2024-01-16 14:00",
        captain: "Capt. John Smith",
        flag: "Marshall Islands",
        length: 185,
        beam: 30,
        draft: 13.0,
        grt: 16000,
        dwt: 35000,
        current_position: {
          lat: -6.95,
          lng: 112.5,
          speed: 12.0,
          heading: 135,
        },
        voyage_info: {
          origin: "Manila Port",
          destination: "Gresik Port",
          charter_party: "PT Cemex Indonesia",
          agent: "Global Shipping Solutions",
        },
        documents: {
          customs_clearance: false,
          port_clearance: false,
          cargo_manifest: true,
          bills_of_lading: true,
        },
        services: {
          pilotage: false,
          tugboat: false,
          linesmen: false,
          bunker: false,
        },
        progress: 0,
        loading_efficiency: 0,
        delays: 0,
      },
    ];

    // Initial data
    setVessels(generateVessels());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setVessels((prev) =>
        prev.map((vessel) => {
          const updatedVessel = { ...vessel };

          // Update progress for berthed vessels
          if (vessel.status === "berthed") {
            updatedVessel.progress = Math.min(
              95,
              vessel.progress + Math.random() * 3
            );
            updatedVessel.loading_efficiency = 75 + Math.random() * 20;
          }

          // Update position for moving vessels
          if (vessel.status === "approaching" || vessel.status === "at_sea") {
            updatedVessel.current_position = {
              ...vessel.current_position,
              lat: vessel.current_position.lat + (Math.random() - 0.5) * 0.001,
              lng: vessel.current_position.lng + (Math.random() - 0.5) * 0.001,
              speed: vessel.current_position.speed + (Math.random() - 0.5) * 2,
            };
            updatedVessel.progress = Math.min(
              100,
              vessel.progress + Math.random() * 2
            );
          }

          return updatedVessel;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter vessels based on status and search term
  const filteredVessels = vessels.filter((vessel) => {
    const matchesFilter = filter === "all" || vessel.status === filter;
    const matchesSearch =
      vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.captain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "berthed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "anchored":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "approaching":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "departing":
        return "bg-green-100 text-green-800 border-green-200";
      case "at_sea":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "berthed":
        return "⚓";
      case "anchored":
        return "🔒";
      case "approaching":
        return "🚢";
      case "departing":
        return "🌊";
      case "at_sea":
        return "🌐";
      default:
        return "❓";
    }
  };

  // Chart data for vessel performance
  const efficiencyData = vessels
    .filter((v) => v.status === "berthed")
    .map((vessel) => ({
      name: vessel.name.split(" ").slice(-1)[0], // Last word of name
      efficiency: vessel.loading_efficiency,
      target: 85,
    }));

  const selectedVesselData = selectedVessel
    ? vessels.find((v) => v.id === selectedVessel)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search vessels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "berthed", "anchored", "approaching", "at_sea"].map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className={
                  filter === status ? "bg-red-600 hover:bg-red-700" : ""
                }
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Vessel Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vessels</p>
              <p className="text-2xl font-bold text-gray-900">
                {vessels.length}
              </p>
            </div>
            <span className="text-2xl">🚢</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Berthed</p>
              <p className="text-2xl font-bold text-blue-600">
                {vessels.filter((v) => v.status === "berthed").length}
              </p>
            </div>
            <span className="text-2xl">⚓</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Waiting</p>
              <p className="text-2xl font-bold text-orange-600">
                {vessels.filter((v) => v.status === "anchored").length}
              </p>
            </div>
            <span className="text-2xl">🔒</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approaching</p>
              <p className="text-2xl font-bold text-yellow-600">
                {vessels.filter((v) => v.status === "approaching").length}
              </p>
            </div>
            <span className="text-2xl">🚢</span>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vessel List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Vessel List
              </h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                + Schedule Vessel
              </Button>
            </div>

            <div className="space-y-4">
              {filteredVessels.map((vessel) => (
                <div
                  key={vessel.id}
                  className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-100 ${
                    selectedVessel === vessel.id
                      ? "ring-2 ring-red-500 bg-red-50"
                      : ""
                  }`}
                  onClick={() => setSelectedVessel(vessel.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {getStatusIcon(vessel.status)}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {vessel.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {vessel.type} • {vessel.flag}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(vessel.status)}>
                        {vessel.status.replace("_", " ")}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {vessel.tonnage.toLocaleString()} tons
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Cargo</p>
                      <p className="text-sm font-medium">{vessel.cargo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Captain</p>
                      <p className="text-sm font-medium">{vessel.captain}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="text-sm font-medium">{vessel.eta}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {vessel.status === "berthed" ? "Berth" : "Position"}
                      </p>
                      <p className="text-sm font-medium">
                        {vessel.berth ||
                          `${vessel.current_position.lat.toFixed(
                            3
                          )}, ${vessel.current_position.lng.toFixed(3)}`}
                      </p>
                    </div>
                  </div>

                  {(vessel.status === "berthed" ||
                    vessel.status === "approaching") && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          {vessel.status === "berthed"
                            ? "Loading Progress"
                            : "Approach Progress"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {vessel.progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            vessel.status === "berthed"
                              ? "bg-blue-600"
                              : "bg-yellow-600"
                          }`}
                          style={{ width: `${vessel.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {vessel.delays > 0 && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <span className="mr-1">⚠️</span>
                      {vessel.delays} hour delay
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Vessel Details / Performance Chart */}
        <div className="space-y-6">
          {selectedVesselData ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vessel Details
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedVessel(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedVesselData.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2">{selectedVesselData.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Flag:</span>
                      <span className="ml-2">{selectedVesselData.flag}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Length:</span>
                      <span className="ml-2">{selectedVesselData.length}m</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Beam:</span>
                      <span className="ml-2">{selectedVesselData.beam}m</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Draft:</span>
                      <span className="ml-2">{selectedVesselData.draft}m</span>
                    </div>
                    <div>
                      <span className="text-gray-500">DWT:</span>
                      <span className="ml-2">
                        {selectedVesselData.dwt.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Voyage Information
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">Origin:</span>
                      <span className="ml-2">
                        {selectedVesselData.voyage_info.origin}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Destination:</span>
                      <span className="ml-2">
                        {selectedVesselData.voyage_info.destination}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Charter Party:</span>
                      <span className="ml-2">
                        {selectedVesselData.voyage_info.charter_party}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Agent:</span>
                      <span className="ml-2">
                        {selectedVesselData.voyage_info.agent}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Current Position
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">Coordinates:</span>
                      <span className="ml-2">
                        {selectedVesselData.current_position.lat.toFixed(4)},{" "}
                        {selectedVesselData.current_position.lng.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Speed:</span>
                      <span className="ml-2">
                        {selectedVesselData.current_position.speed.toFixed(1)}{" "}
                        knots
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Heading:</span>
                      <span className="ml-2">
                        {selectedVesselData.current_position.heading}°
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Documents</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedVesselData.documents).map(
                      ([doc, status]) => (
                        <div key={doc} className="flex items-center text-sm">
                          <span
                            className={
                              status ? "text-green-600" : "text-red-600"
                            }
                          >
                            {status ? "✓" : "✗"}
                          </span>
                          <span className="ml-2 capitalize">
                            {doc.replace("_", " ")}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Services</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedVesselData.services).map(
                      ([service, requested]) => (
                        <div
                          key={service}
                          className="flex items-center text-sm"
                        >
                          <span
                            className={
                              requested ? "text-blue-600" : "text-gray-400"
                            }
                          >
                            {requested ? "●" : "○"}
                          </span>
                          <span className="ml-2 capitalize">{service}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {selectedVesselData.status === "berthed" && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Loading Performance
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>{selectedVesselData.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedVesselData.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Efficiency:</span>
                        <span>
                          {selectedVesselData.loading_efficiency.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${selectedVesselData.loading_efficiency}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Loading Efficiency
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#dc2626" name="Current" />
                  <Line
                    dataKey="target"
                    stroke="#6b7280"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                📋 Schedule Inspection
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                🚁 Request Pilot
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                ⛽ Arrange Bunker
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                📄 Generate Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VesselManagement;
