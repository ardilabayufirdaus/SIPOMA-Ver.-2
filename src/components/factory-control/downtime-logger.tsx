"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  StopCircle,
  PlayCircle,
  Users,
  Wrench,
  Zap,
  Calendar,
  Timer,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DowntimeEvent {
  id: string;
  equipment: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  reason: string;
  category: "mechanical" | "electrical" | "planned" | "operational" | "quality";
  severity: "minor" | "major" | "critical";
  status: "active" | "resolved";
  reportedBy: string;
  description: string;
  rootCause?: string;
  correctionAction?: string;
  preventiveAction?: string;
  cost?: number;
}

interface DowntimeStats {
  equipment: string;
  totalDowntime: number;
  frequency: number;
  avgDuration: number;
  mtbf: number;
}

const mockDowntimeEvents: DowntimeEvent[] = [
  {
    id: "dt_001",
    equipment: "Cement Mill #1",
    startTime: "2024-01-15T08:30:00Z",
    endTime: "2024-01-15T10:45:00Z",
    duration: 135,
    reason: "Bearing failure",
    category: "mechanical",
    severity: "major",
    status: "resolved",
    reportedBy: "John Smith",
    description:
      "Main drive bearing showing signs of excessive wear and vibration",
    rootCause: "Insufficient lubrication during previous maintenance",
    correctionAction: "Replaced bearing and improved lubrication procedure",
    preventiveAction: "Implement automated lubrication system",
    cost: 25000,
  },
  {
    id: "dt_002",
    equipment: "Raw Mill #1",
    startTime: "2024-01-15T12:00:00Z",
    reason: "Planned maintenance",
    category: "planned",
    severity: "minor",
    status: "active",
    reportedBy: "Maintenance Team",
    description: "Scheduled preventive maintenance for mill liners inspection",
    cost: 5000,
  },
  {
    id: "dt_003",
    equipment: "Kiln #1",
    startTime: "2024-01-14T16:20:00Z",
    endTime: "2024-01-14T18:10:00Z",
    duration: 110,
    reason: "Power supply failure",
    category: "electrical",
    severity: "critical",
    status: "resolved",
    reportedBy: "Control Room",
    description: "Main power transformer tripped due to overload",
    rootCause: "Aging transformer with reduced capacity",
    correctionAction:
      "Temporary power rerouting, scheduled transformer replacement",
    preventiveAction: "Upgrade electrical infrastructure",
    cost: 45000,
  },
  {
    id: "dt_004",
    equipment: "Cement Mill #2",
    startTime: "2024-01-14T09:15:00Z",
    endTime: "2024-01-14T09:45:00Z",
    duration: 30,
    reason: "Product quality issue",
    category: "quality",
    severity: "minor",
    status: "resolved",
    reportedBy: "Quality Control",
    description: "Cement fineness out of specification",
    rootCause: "Separator efficiency degradation",
    correctionAction: "Adjusted separator speed and air flow",
    preventiveAction: "Regular separator maintenance schedule",
    cost: 2000,
  },
];

const mockDowntimeStats: DowntimeStats[] = [
  {
    equipment: "Cement Mill #1",
    totalDowntime: 480,
    frequency: 12,
    avgDuration: 40,
    mtbf: 720,
  },
  {
    equipment: "Cement Mill #2",
    totalDowntime: 320,
    frequency: 8,
    avgDuration: 40,
    mtbf: 1080,
  },
  {
    equipment: "Raw Mill #1",
    totalDowntime: 720,
    frequency: 6,
    avgDuration: 120,
    mtbf: 1440,
  },
  {
    equipment: "Kiln #1",
    totalDowntime: 380,
    frequency: 4,
    avgDuration: 95,
    mtbf: 2160,
  },
  {
    equipment: "Coal Mill #1",
    totalDowntime: 240,
    frequency: 10,
    avgDuration: 24,
    mtbf: 864,
  },
];

const categoryColors = {
  mechanical: "#dc2626",
  electrical: "#f59e0b",
  planned: "#22c55e",
  operational: "#2563eb",
  quality: "#8b5cf6",
};

export default function DowntimeLogger() {
  const [downtimeEvents, setDowntimeEvents] =
    useState<DowntimeEvent[]>(mockDowntimeEvents);
  const [selectedEvent, setSelectedEvent] = useState<DowntimeEvent | null>(
    null
  );
  const [newEventForm, setNewEventForm] = useState({
    equipment: "",
    reason: "",
    category: "mechanical" as DowntimeEvent["category"],
    severity: "minor" as DowntimeEvent["severity"],
    description: "",
    reportedBy: "",
  });
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mechanical":
        return "bg-red-100 text-red-800 border-red-200";
      case "electrical":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "planned":
        return "bg-green-100 text-green-800 border-green-200";
      case "operational":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "quality":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "bg-blue-100 text-blue-800";
      case "major":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <StopCircle className="h-4 w-4 text-red-600" />;
      case "resolved":
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleNewEvent = () => {
    const newEvent: DowntimeEvent = {
      id: `dt_${Date.now()}`,
      equipment: newEventForm.equipment,
      startTime: new Date().toISOString(),
      reason: newEventForm.reason,
      category: newEventForm.category,
      severity: newEventForm.severity,
      status: "active",
      reportedBy: newEventForm.reportedBy,
      description: newEventForm.description,
    };

    setDowntimeEvents((prev) => [newEvent, ...prev]);
    setShowNewEventForm(false);
    setNewEventForm({
      equipment: "",
      reason: "",
      category: "mechanical",
      severity: "minor",
      description: "",
      reportedBy: "",
    });
  };

  const resolveEvent = (eventId: string) => {
    setDowntimeEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: "resolved",
              endTime: new Date().toISOString(),
              duration: Math.floor(
                (new Date().getTime() - new Date(event.startTime).getTime()) /
                  60000
              ),
            }
          : event
      )
    );
  };

  const activeEvents = downtimeEvents.filter(
    (event) => event.status === "active"
  );
  const resolvedEvents = downtimeEvents.filter(
    (event) => event.status === "resolved"
  );
  const totalDowntime = resolvedEvents.reduce(
    (sum, event) => sum + (event.duration || 0),
    0
  );
  const avgResolutionTime =
    resolvedEvents.length > 0
      ? resolvedEvents.reduce((sum, event) => sum + (event.duration || 0), 0) /
        resolvedEvents.length
      : 0;

  const categoryData = Object.keys(categoryColors).map((category) => ({
    name: category,
    value: downtimeEvents.filter((event) => event.category === category).length,
    color: categoryColors[category as keyof typeof categoryColors],
  }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {activeEvents.length}
              </p>
              <p className="text-sm text-gray-600">Active Events</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {totalDowntime}
              </p>
              <p className="text-sm text-gray-600">Total Downtime (min)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Timer className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {avgResolutionTime.toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Avg Resolution (min)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {downtimeEvents.length}
              </p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Event Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Downtime Events
            </h2>
            <Button
              onClick={() => setShowNewEventForm(true)}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Log New Event
            </Button>
          </div>

          {/* New Event Form */}
          {showNewEventForm && (
            <Card>
              <CardHeader>
                <CardTitle>Log New Downtime Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment
                    </label>
                    <select
                      value={newEventForm.equipment}
                      onChange={(e) =>
                        setNewEventForm((prev) => ({
                          ...prev,
                          equipment: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="">Select Equipment</option>
                      <option value="Cement Mill #1">Cement Mill #1</option>
                      <option value="Cement Mill #2">Cement Mill #2</option>
                      <option value="Raw Mill #1">Raw Mill #1</option>
                      <option value="Kiln #1">Kiln #1</option>
                      <option value="Coal Mill #1">Coal Mill #1</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newEventForm.category}
                      onChange={(e) =>
                        setNewEventForm((prev) => ({
                          ...prev,
                          category: e.target.value as DowntimeEvent["category"],
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="mechanical">Mechanical</option>
                      <option value="electrical">Electrical</option>
                      <option value="planned">Planned</option>
                      <option value="operational">Operational</option>
                      <option value="quality">Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={newEventForm.severity}
                      onChange={(e) =>
                        setNewEventForm((prev) => ({
                          ...prev,
                          severity: e.target.value as DowntimeEvent["severity"],
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reported By
                    </label>
                    <input
                      type="text"
                      value={newEventForm.reportedBy}
                      onChange={(e) =>
                        setNewEventForm((prev) => ({
                          ...prev,
                          reportedBy: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={newEventForm.reason}
                    onChange={(e) =>
                      setNewEventForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Brief reason for downtime"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEventForm.description}
                    onChange={(e) =>
                      setNewEventForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Detailed description of the issue"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleNewEvent}>Log Event</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewEventForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {downtimeEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedEvent?.id === event.id
                        ? "ring-2 ring-red-600"
                        : "hover:shadow-md"
                    }`}
                    onClick={() =>
                      setSelectedEvent(
                        selectedEvent?.id === event.id ? null : event
                      )
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(event.status)}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {event.equipment}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {event.reason}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category.toUpperCase()}
                        </Badge>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Start Time</p>
                        <p className="font-medium">
                          {new Date(event.startTime).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium">
                          {event.duration ? `${event.duration} min` : "Ongoing"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reported By</p>
                        <p className="font-medium">{event.reportedBy}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      {event.description}
                    </p>

                    {event.status === "active" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            resolveEvent(event.id);
                          }}
                          className="flex items-center gap-2"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </div>
                    )}

                    {selectedEvent?.id === event.id &&
                      event.status === "resolved" && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                          {event.rootCause && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Root Cause:
                              </p>
                              <p className="text-sm text-gray-600">
                                {event.rootCause}
                              </p>
                            </div>
                          )}
                          {event.correctionAction && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Correction Action:
                              </p>
                              <p className="text-sm text-gray-600">
                                {event.correctionAction}
                              </p>
                            </div>
                          )}
                          {event.preventiveAction && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Preventive Action:
                              </p>
                              <p className="text-sm text-gray-600">
                                {event.preventiveAction}
                              </p>
                            </div>
                          )}
                          {event.cost && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Cost Impact:
                              </p>
                              <p className="text-sm text-gray-600">
                                ${event.cost.toLocaleString("id-ID")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Reports */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Downtime by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm capitalize">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {category.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Downtime</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockDowntimeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="equipment"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="totalDowntime"
                    fill="#dc2626"
                    name="Total Downtime (min)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm" variant="outline" className="w-full">
                Generate Report
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Export Data
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Schedule Maintenance
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                MTBF Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
