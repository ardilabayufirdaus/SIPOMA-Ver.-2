"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { projectsDummyData, ProjectData } from "@/constants/project-dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SCurveChart from "./SCurveChart";
import ProjectForm from "./ProjectForm";
import ProjectFilters from "./ProjectFilters";
import ProjectStats from "./ProjectStats";
import {
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  Edit,
  Info,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";

const statusIcons = {
  Planning: Clock,
  "In Progress": BarChart3,
  "On Hold": PauseCircle,
  Completed: CheckCircle,
  Cancelled: XCircle,
};

const statusColors = {
  Planning: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-green-100 text-green-800 border-green-200",
  "On Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Completed: "bg-gray-100 text-gray-800 border-gray-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<ProjectData[]>(projectsDummyData);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "list" | "chart" | "kanban" | "timeline"
  >("list");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(
    null
  );
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [highlightedProjectId, setHighlightedProjectId] = useState<
    string | null
  >(null);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000); // Auto-hide after 3 seconds
  };
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [managerFilter, setManagerFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "name" | "progress" | "endDate" | "budget"
  >("name");

  // Activity row type and dummy table state for the floating editor modal
  type ActivityRow = {
    id: string;
    aktivitas: string;
    status: ProjectData["status"];
    bobot: number;
    rencanaMulai: string;
    rencanaSelesai: string;
    aktualMulai?: string;
    aktualSelesai?: string;
    persenSelesai: number;
  };

  const [activityRows, setActivityRows] = useState<ActivityRow[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  type UndoEntry =
    | { type: "delete"; payload: ActivityRow }
    | { type: "reorder"; payload: { from: number; to: number } };
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  // editable project fields for modal
  const [editingFields, setEditingFields] =
    useState<Partial<ProjectData> | null>(null);
  const [computedProgress, setComputedProgress] = useState<number>(0);

  // removed helper; dummy rows are created inline when modal opens

  useEffect(() => {
    if (showEditorModal && editingProject) {
      const proj = editingProject;
      const start = proj?.startDate ?? new Date().toISOString().slice(0, 10);
      const end = proj?.endDate ?? new Date().toISOString().slice(0, 10);
      setActivityRows([
        {
          id: "a1",
          aktivitas: "Survey & Analisis",
          status: "Planning",
          bobot: 20,
          rencanaMulai: start,
          rencanaSelesai: start,
          aktualMulai: "",
          aktualSelesai: "",
          persenSelesai: 0,
        },
        {
          id: "a2",
          aktivitas: "Desain Solusi",
          status: "In Progress",
          bobot: 30,
          rencanaMulai: start,
          rencanaSelesai: end,
          aktualMulai: "",
          aktualSelesai: "",
          persenSelesai: 10,
        },
        {
          id: "a3",
          aktivitas: "Implementasi & Pengujian",
          status: "Planning",
          bobot: 30,
          rencanaMulai: start,
          rencanaSelesai: end,
          aktualMulai: "",
          aktualSelesai: "",
          persenSelesai: 0,
        },
        {
          id: "a4",
          aktivitas: "Go-Live & Handover",
          status: "Planning",
          bobot: 20,
          rencanaMulai: end,
          rencanaSelesai: end,
          aktualMulai: "",
          aktualSelesai: "",
          persenSelesai: 0,
        },
      ]);
      setEditingFields({ ...editingProject });
    }
  }, [showEditorModal, editingProject]);

  const daysBetween = (a?: string, b?: string) => {
    if (!a || !b) return 0;
    const da = new Date(a);
    const db = new Date(b);
    const diff = Math.ceil(
      (db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff >= 0 ? diff : 0;
  };

  const computeStatusFromProgress = (
    progress: number
  ): ProjectData["status"] => {
    if (progress >= 100) return "Completed";
    if (progress > 0) return "In Progress";
    return "Planning";
  };

  const updateActivityRow = <K extends keyof ActivityRow>(
    id: string,
    key: K,
    value: ActivityRow[K]
  ) => {
    setActivityRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  };

  const addActivityRow = () => {
    const start =
      editingFields?.startDate ?? new Date().toISOString().slice(0, 10);
    const end = editingFields?.endDate ?? start;
    const newRow: ActivityRow = {
      id: `a${Date.now()}`,
      aktivitas: "New Activity",
      status: "Planning",
      bobot: 0,
      rencanaMulai: start,
      rencanaSelesai: end,
      aktualMulai: "",
      aktualSelesai: "",
      persenSelesai: 0,
    };
    setActivityRows((prev) => [...prev, newRow]);
  };

  const removeActivityRow = (id: string) => {
    // soft-confirm inline: toggle pendingDeleteId, require second click to confirm
    if (pendingDeleteId === id) {
      // perform delete and push undo
      const toDelete = activityRows.find((r) => r.id === id);
      if (!toDelete) return;
      setActivityRows((prev) => prev.filter((r) => r.id !== id));
      setUndoStack((s) => [{ type: "delete", payload: toDelete }, ...s]);
      setPendingDeleteId(null);
      // show small undo message via temporary successMessage
      showSuccessMessage("Activity deleted — Undo available");
      return;
    }
    setPendingDeleteId(id);
  };

  // Drag & drop reordering
  const dragStartIndex = useRef<number | null>(null);
  const onRowDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    idx: number
  ) => {
    dragStartIndex.current = idx;
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
    e.dataTransfer.effectAllowed = "move";
    // add dragging class for a11y
    (e.currentTarget as HTMLElement).classList.add("opacity-60");
  };
  const onRowDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // compute index from target row
    const el = e.currentTarget as HTMLElement;
    const idxAttr = el.getAttribute("data-idx");
    if (idxAttr) setDragOverIndex(Number(idxAttr));
  };
  const onRowDrop = (e: React.DragEvent<HTMLTableRowElement>, idx: number) => {
    e.preventDefault();
    const from = dragStartIndex.current;
    if (from === null || from === undefined) return;
    if (from === idx) return;
    setActivityRows((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(idx, 0, moved);
      // push reorder to undo stack (store indices)
      setUndoStack((s) => [
        { type: "reorder", payload: { from, to: idx } },
        ...s,
      ]);
      return copy;
    });
    dragStartIndex.current = null;
    setDragOverIndex(null);
  };

  const undoLast = () => {
    const last = undoStack[0];
    if (!last) return;
    setUndoStack((s) => s.slice(1));
    if (last.type === "delete") {
      setActivityRows((prev) => [last.payload, ...prev]);
      showSuccessMessage("Delete undone");
    } else if (last.type === "reorder") {
      const { from, to } = last.payload;
      setActivityRows((prev) => {
        const copy = [...prev];
        // find moved item at `to` and move back to `from` if possible
        const [moved] = copy.splice(to, 1);
        copy.splice(from, 0, moved);
        return copy;
      });
      showSuccessMessage("Reorder undone");
    }
  };

  // Export / Import CSV (Excel-compatible)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportActivitiesExcel = () => {
    if (!activityRows || activityRows.length === 0) {
      alert("No activities to export");
      return;
    }
    const headers = [
      "id",
      "aktivitas",
      "status",
      "bobot",
      "rencanaMulai",
      "rencanaSelesai",
      "aktualMulai",
      "aktualSelesai",
      "persenSelesai",
    ];
    const data = activityRows.map((r) => ({
      id: r.id,
      aktivitas: r.aktivitas,
      status: r.status,
      bobot: r.bobot,
      rencanaMulai: r.rencanaMulai,
      rencanaSelesai: r.rencanaSelesai,
      aktualMulai: r.aktualMulai ?? "",
      aktualSelesai: r.aktualSelesai ?? "",
      persenSelesai: r.persenSelesai,
    }));
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activities");
    XLSX.writeFile(wb, `${editingFields?.name ?? "activities"}.xlsx`);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (!json.length) return;
      const imported: ActivityRow[] = json.map((row, i) => {
        const rencanaMulai =
          row.rencanaMulai && !isNaN(Date.parse(row.rencanaMulai))
            ? new Date(row.rencanaMulai).toISOString().slice(0, 10)
            : editingFields?.startDate ?? new Date().toISOString().slice(0, 10);
        const rencanaSelesai =
          row.rencanaSelesai && !isNaN(Date.parse(row.rencanaSelesai))
            ? new Date(row.rencanaSelesai).toISOString().slice(0, 10)
            : rencanaMulai;
        return {
          id: row.id || `imp-${Date.now()}-${i}`,
          aktivitas: row.aktivitas || `Imported ${i + 1}`,
          status: (row.status as ActivityRow["status"]) || "Planning",
          bobot: Number(row.bobot) || 0,
          rencanaMulai,
          rencanaSelesai,
          aktualMulai: row.aktualMulai || "",
          aktualSelesai: row.aktualSelesai || "",
          persenSelesai: Number(row.persenSelesai) || 0,
        } as ActivityRow;
      });
      setActivityRows(imported);
    };
    reader.readAsArrayBuffer(file);
  };

  // Whenever activityRows change (dates or new rows), recompute bobot and update only if changed
  useEffect(() => {
    if (!activityRows || activityRows.length === 0) return;

    // Recompute bobot based on rencana duration (relative share of total duration)
    const rows = activityRows;
    // compute durations in days (at least 1)
    const durations = rows.map((r) => {
      const d = daysBetween(r.rencanaMulai, r.rencanaSelesai);
      return d > 0 ? d : 1;
    });
    const total = durations.reduce((s, v) => s + v, 0);
    if (total === 0) return;

    // compute proportional percentages, round down and collect remainder
    const rawPercents = durations.map((d) => (d / total) * 100);
    const floored = rawPercents.map((p) => Math.floor(p));
    const flooredSum = floored.reduce((s, v) => s + v, 0);
    // distribute remaining percentage points to rows with largest fractional parts
    const fractions = rawPercents.map((p, i) => ({ frac: p - floored[i], i }));
    fractions.sort((a, b) => b.frac - a.frac);
    const remainder = 100 - flooredSum;
    const adjusted = [...floored];
    for (let k = 0; k < remainder; k++) {
      adjusted[fractions[k % fractions.length].i]++;
    }

    // produce new rows with updated bobot and status derived from persenSelesai
    const recomputed = rows.map((r, idx) => {
      const derivedStatus = computeStatusFromProgress(
        Number(r.persenSelesai || 0)
      );
      return { ...r, bobot: adjusted[idx], status: derivedStatus };
    });
    // compute project progress from recomputed bobot and activity persenSelesai
    const prog = recomputed.reduce(
      (sum, r) =>
        sum + (Number(r.bobot || 0) * Number(r.persenSelesai || 0)) / 100,
      0
    );
    const roundedProg = Math.round(prog);
    setComputedProgress(roundedProg);
    // detect change
    const changed = recomputed.some(
      (nr, i) => nr.bobot !== activityRows[i].bobot
    );
    if (changed) setActivityRows(recomputed);
    // Auto-set project startDate in the editing modal from the earliest rencanaMulai
    // (use functional update to avoid adding editingFields to deps and to prevent loops)
    try {
      const validStarts = recomputed.map((r) => r.rencanaMulai).filter(Boolean);
      if (validStarts.length > 0) {
        const earliest = validStarts.reduce((a, b) => (a < b ? a : b));
        setEditingFields((prev) => {
          if (!prev) return prev;
          if (prev.startDate === earliest) return prev;
          return { ...prev, startDate: earliest };
        });
      }
    } catch (e) {
      // defensive: ignore anything unexpected here to avoid breaking the editor effect
      // console.error(e);
    }

    // Also auto-set project endDate from the latest rencanaSelesai among activities
    try {
      const validEnds = recomputed.map((r) => r.rencanaSelesai).filter(Boolean);
      if (validEnds.length > 0) {
        const latest = validEnds.reduce((a, b) => (a > b ? a : b));
        setEditingFields((prev) => {
          if (!prev) return prev;
          if (prev.endDate === latest) return prev;
          return { ...prev, endDate: latest };
        });
      }
    } catch (e) {
      // ignore
    }
  }, [activityRows]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.manager.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesManager =
        managerFilter === "all" || project.manager === managerFilter;
      return matchesSearch && matchesStatus && matchesManager;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.progress - a.progress;
        case "endDate":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case "budget":
          return b.budget - a.budget;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, managerFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setManagerFilter("all");
    setSortBy("name");
  };

  const updateProject = (updatedProject: ProjectData) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const addProject = (newProject: ProjectData) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (endDate: string) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProjectStatusColor = (days: number, progress: number) => {
    if (progress >= 100) return "text-green-600";
    if (days < 0) return "text-red-600";
    if (days <= 30) return "text-orange-600";
    return "text-gray-600";
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Project Code",
        "Project Name",
        "Status",
        "Progress",
        "Manager",
        "Budget",
        "Start Date",
        "End Date",
      ],
      ...filteredProjects.map((project) => [
        project.code,
        project.name,
        project.status,
        `${project.progress}%`,
        project.manager,
        formatCurrency(project.budget),
        formatDate(project.startDate),
        formatDate(project.endDate),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (viewMode === "chart" && selectedProject) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              S-Curve Analysis
            </h1>
            <p className="text-gray-600 mt-1">{selectedProject.name}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setViewMode("list")} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => setViewMode("kanban")} variant="outline">
              Kanban View
            </Button>
          </div>
        </div>
        <SCurveChart
          data={selectedProject.sCurveData}
          projectName={selectedProject.name}
          projectCode={selectedProject.code}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Project Management
          </h1>
          <p className="text-red-700 mt-1 font-semibold">
            Pantau dan kelola semua proyek Departemen Produksi Klinker & Semen
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Proyek Baru
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage("")}
          >
            <XCircle className="h-5 w-5 text-green-500" />
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <ProjectStats projects={projects} />

      {/* Filters and Search */}
      <ProjectFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        managerFilter={managerFilter}
        onManagerFilterChange={setManagerFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={clearFilters}
      />

      {/* Project List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Proyek ({filteredProjects.length})</span>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                Kanban
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                Timeline
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredProjects.map((project: ProjectData) => {
                const StatusIcon = statusIcons[project.status];
                const daysUntilDeadline = getDaysUntilDeadline(project.endDate);
                const statusColor = getProjectStatusColor(
                  daysUntilDeadline,
                  project.progress
                );

                return (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="text-lg font-semibold">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {project.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${statusColors[project.status]} border`}
                        >
                          {project.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProject(project);
                              setViewMode("chart");
                            }}
                            className="tap-target transition-smooth"
                          >
                            S-Curve
                          </Button>
                          <Tooltip
                            content={
                              project.status === "Cancelled"
                                ? "Cannot edit cancelled project"
                                : project.status === "Completed"
                                ? "Edit project (completed)"
                                : "Edit project"
                            }
                          >
                            <span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingProject(project);
                                  setShowEditorModal(true);
                                }}
                                disabled={project.status === "Cancelled"}
                                aria-label="Edit project"
                                className="tap-target transition-smooth"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </span>
                          </Tooltip>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedProject(
                                selectedProject?.id === project.id
                                  ? null
                                  : project
                              )
                            }
                            className="tap-target transition-smooth"
                          >
                            {selectedProject?.id === project.id
                              ? "Tutup"
                              : "Detail"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {project.manager}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatDate(project.startDate)} -{" "}
                          {formatDate(project.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatCurrency(project.budget)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-4 h-4 ${statusColor}`} />
                        <span className={`text-sm ${statusColor}`}>
                          {daysUntilDeadline > 0
                            ? `${daysUntilDeadline} hari`
                            : daysUntilDeadline === 0
                            ? "Hari ini"
                            : `${Math.abs(daysUntilDeadline)} hari terlambat`}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Risk Indicator */}
                    {project.risks.filter((risk) => risk.severity === "High")
                      .length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {
                            project.risks.filter(
                              (risk) => risk.severity === "High"
                            ).length
                          }{" "}
                          risiko tinggi
                        </span>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {selectedProject?.id === project.id && (
                      <div className="mt-6 pt-6 border-t space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Milestones */}
                          <div>
                            <h4 className="text-sm font-medium mb-3">
                              Milestones
                            </h4>
                            <div className="space-y-2">
                              {project.milestones.map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center space-x-2">
                                    {milestone.completed ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="text-sm">
                                      {milestone.name}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(milestone.date)} (
                                    {milestone.progress}%)
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Risks */}
                          <div>
                            <h4 className="text-sm font-medium mb-3">Risks</h4>
                            <div className="space-y-2">
                              {project.risks.map((risk) => (
                                <div
                                  key={risk.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{
                                        backgroundColor:
                                          risk.severity === "High"
                                            ? "#ef4444"
                                            : risk.severity === "Medium"
                                            ? "#f59e0b"
                                            : "#22c55e",
                                      }}
                                    />
                                    <span className="text-sm">
                                      {risk.description}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {risk.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* KPIs and Team Members removed as requested */}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="w-full overflow-x-auto">
              <div className="flex gap-4 min-w-[900px]">
                {(
                  [
                    "Planning",
                    "In Progress",
                    "On Hold",
                    "Completed",
                    "Cancelled",
                  ] as const
                ).map((status) => {
                  const columnProjects = filteredProjects.filter(
                    (p) => p.status === status
                  );

                  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                  };

                  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    if (!id) return;
                    const proj = projects.find((p) => p.id === id);
                    if (!proj) return;
                    if (proj.status === status) return; // no-op
                    const updated = {
                      ...proj,
                      status: status as ProjectData["status"],
                    };
                    updateProject(updated);
                    showSuccessMessage(`"${updated.name}" moved to ${status}`);
                  };

                  return (
                    <div
                      key={status}
                      className="w-64 bg-gray-50 border rounded-lg p-3 flex-shrink-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium">{status}</div>
                        <div className="text-xs text-gray-500">
                          {columnProjects.length}
                        </div>
                      </div>

                      <div
                        className="space-y-3 min-h-[200px]"
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        role="list"
                      >
                        {columnProjects.length === 0 && (
                          <div className="text-xs text-gray-400">
                            Tidak ada proyek
                          </div>
                        )}

                        {columnProjects.map((project) => (
                          <div
                            key={project.id}
                            draggable
                            onDragStart={(e) =>
                              e.dataTransfer.setData("text/plain", project.id)
                            }
                            className={`p-3 bg-white border rounded shadow-sm hover:shadow-md cursor-grab ${
                              highlightedProjectId === project.id
                                ? "ring-2 ring-blue-400"
                                : ""
                            }`}
                            role="listitem"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-sm font-semibold">
                                  {project.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {project.code}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {project.manager}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={`${
                                    statusColors[project.status]
                                  } border`}
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="text-xs text-gray-500">
                                Progress: {project.progress}%
                              </div>
                              <div className="text-xs text-gray-400">
                                Ends: {formatDate(project.endDate)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "timeline" && (
            <div className="text-center py-8 text-gray-500">
              Timeline view akan diimplementasikan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Project Form Modal */}
      {showCreateForm && (
        <ProjectForm
          onCancel={() => setShowCreateForm(false)}
          onSave={(newProject: ProjectData) => {
            addProject(newProject);
            setShowCreateForm(false);
            showSuccessMessage(
              `Project "${newProject.name}" has been created successfully!`
            );
          }}
        />
      )}

      {/* Edit Project Form Modal */}
      {editingProject && (
        <ProjectForm
          project={editingProject}
          onCancel={() => setEditingProject(null)}
          onSave={(updatedProject: ProjectData) => {
            updateProject(updatedProject);
            setEditingProject(null);
            showSuccessMessage(
              `Project "${updatedProject.name}" has been updated successfully!`
            );
          }}
        />
      )}
      {/* Floating Editor Modal (opened from Edit button) */}
      {showEditorModal && editingProject && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => {
              if (
                !confirm("Tutup editor? Perubahan belum tersimpan akan hilang.")
              )
                return;
              setShowEditorModal(false);
              setEditingProject(null);
            }}
          />
          <div className="relative w-[99%] max-w-[1200px] max-h-[92vh]">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto animate-fadein">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-3">
                    Edit Project - Activities
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <input
                      className="col-span-2 rounded border px-3 py-2"
                      value={editingFields?.name ?? ""}
                      onChange={(e) =>
                        setEditingFields((s) => ({
                          ...(s || {}),
                          name: e.target.value,
                        }))
                      }
                      placeholder="Project Name"
                    />
                    <input
                      className="rounded border px-3 py-2"
                      value={editingFields?.code ?? ""}
                      onChange={(e) =>
                        setEditingFields((s) => ({
                          ...(s || {}),
                          code: e.target.value,
                        }))
                      }
                      placeholder="Project Code"
                    />
                    <input
                      className="rounded border px-3 py-2"
                      value={editingFields?.manager ?? ""}
                      onChange={(e) =>
                        setEditingFields((s) => ({
                          ...(s || {}),
                          manager: e.target.value,
                        }))
                      }
                      placeholder="PIC / Manager"
                    />
                    {/* Status is derived from progress and should not be edited manually */}
                    <div className="flex items-center gap-2">
                      {/* compute displayed status from current progress (editingFields falls back to editingProject) */}
                      {(() => {
                        const derived = computeStatusFromProgress(
                          Number(
                            editingFields?.progress ?? editingProject.progress
                          )
                        );
                        return (
                          <Badge className={`${statusColors[derived]} border`}>
                            {derived}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        readOnly
                        className="rounded border px-3 py-2 bg-gray-50 cursor-not-allowed"
                        value={editingFields?.startDate ?? ""}
                        onChange={(e) =>
                          setEditingFields((s) => ({
                            ...(s || {}),
                            startDate: e.target.value,
                          }))
                        }
                        aria-label="Project start date (auto-derived)"
                      />
                      <div className="absolute right-2 top-2">
                        <Tooltip
                          content={
                            "Tanggal awal proyek diisi otomatis dari aktivitas pertama"
                          }
                        >
                          <Info className="w-4 h-4 text-gray-400" />
                        </Tooltip>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Otoderivasi dari aktivitas
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        readOnly
                        className="rounded border px-3 py-2 bg-gray-50 cursor-not-allowed"
                        value={editingFields?.endDate ?? ""}
                        onChange={(e) =>
                          setEditingFields((s) => ({
                            ...(s || {}),
                            endDate: e.target.value,
                          }))
                        }
                        aria-label="Project end date (auto-derived)"
                      />
                      <div className="absolute right-2 top-2">
                        <Tooltip
                          content={
                            "Tanggal akhir proyek diisi otomatis dari aktivitas terakhir"
                          }
                        >
                          <Info className="w-4 h-4 text-gray-400" />
                        </Tooltip>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Otoderivasi dari aktivitas
                      </div>
                    </div>
                    {/* Progress is computed from activity completion and not editable here */}
                    <div className="flex items-center gap-2">
                      <div className="rounded border px-3 py-2 text-right bg-gray-50">
                        {computedProgress}%
                      </div>
                      <Tooltip
                        content={
                          "Progress dihitung otomatis dari jumlah bobot x % selesai tiap aktivitas"
                        }
                      >
                        <Info className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </div>
                    <input
                      type="number"
                      className="rounded border px-3 py-2"
                      value={editingFields?.budget ?? 0}
                      onChange={(e) =>
                        setEditingFields((s) => ({
                          ...(s || {}),
                          budget: Number(e.target.value),
                        }))
                      }
                    />
                    <input
                      className="col-span-3 rounded border px-3 py-2"
                      value={editingFields?.description ?? ""}
                      onChange={(e) =>
                        setEditingFields((s) => ({
                          ...(s || {}),
                          description: e.target.value,
                        }))
                      }
                      placeholder="Description"
                    />
                  </div>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowEditorModal(false);
                      setEditingProject(null);
                      setEditingFields(null);
                    }}
                  >
                    Tutup
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ref={fileInputRef}
                    onChange={(e) => handleImportFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    onClick={exportActivitiesExcel}
                    className="border bg-white flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Excel</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border bg-white flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Import Excel</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={addActivityRow}
                    className="bg-red-600 text-white flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Activity</span>
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto border-collapse min-w-[900px] table-min-w">
                  <thead className="bg-white sticky top-0 z-20 shadow-sm">
                    <tr className="text-left border-b">
                      <th className="p-2 w-8 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        No.
                      </th>
                      <th className="p-2 text-center">&nbsp;</th>
                      <th className="p-2 w-[520px] text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Aktivitas
                      </th>
                      <th className="p-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="p-2 w-24 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Bobot (%){" "}
                        <Tooltip
                          content={
                            "Bobot dihitung otomatis berdasarkan durasi rencana tiap aktivitas; total akan 100%"
                          }
                        >
                          <Info className="inline w-4 h-4 text-gray-400" />
                        </Tooltip>
                      </th>
                      <th className="p-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Rencana Mulai
                      </th>
                      <th className="p-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Rencana Selesai
                      </th>
                      <th className="p-2 w-24 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Durasi (Hari)
                      </th>
                      <th className="p-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Aktual Mulai
                      </th>
                      <th className="p-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Aktual Selesai
                      </th>
                      <th className="p-2 w-24 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        % Selesai
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } ${
                          dragOverIndex === idx
                            ? "ring-2 ring-yellow-300 bg-yellow-50"
                            : ""
                        } hover:shadow-sm hover:bg-gray-100 transition-smooth`}
                        data-idx={idx}
                        draggable
                        onDragStart={(e) => onRowDragStart(e, idx)}
                        onDragOver={onRowDragOver}
                        onDrop={(e) => onRowDrop(e, idx)}
                      >
                        <td className="p-2 align-top flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab touch-none" />
                          <div className="text-xs text-gray-500">{idx + 1}</div>
                        </td>
                        <td className="p-2 align-top w-[520px]">
                          <div className="flex items-center gap-2">
                            <button
                              className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100"
                              onClick={() => {
                                if (idx <= 0) return;
                                setActivityRows((prev) => {
                                  const copy = [...prev];
                                  const [a] = copy.splice(idx, 1);
                                  copy.splice(idx - 1, 0, a);
                                  setUndoStack((s) => [
                                    {
                                      type: "reorder",
                                      payload: { from: idx, to: idx - 1 },
                                    },
                                    ...s,
                                  ]);
                                  return copy;
                                });
                              }}
                              aria-label="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100"
                              onClick={() => {
                                if (idx >= activityRows.length - 1) return;
                                setActivityRows((prev) => {
                                  const copy = [...prev];
                                  const [a] = copy.splice(idx, 1);
                                  copy.splice(idx + 1, 0, a);
                                  setUndoStack((s) => [
                                    {
                                      type: "reorder",
                                      payload: { from: idx, to: idx + 1 },
                                    },
                                    ...s,
                                  ]);
                                  return copy;
                                });
                              }}
                              aria-label="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <input
                              className="w-full min-w-[360px] rounded border px-2 py-1 whitespace-normal text-sm"
                              value={row.aktivitas}
                              onChange={(e) =>
                                updateActivityRow(
                                  row.id,
                                  "aktivitas",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {pendingDeleteId === row.id
                              ? "Click delete again to confirm"
                              : ""}
                          </div>
                        </td>
                        <td className="p-2 align-top">
                          <div className="mt-2">
                            <Button
                              variant={
                                pendingDeleteId === row.id
                                  ? "destructive"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => removeActivityRow(row.id)}
                              className={`text-red-500`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-2 align-top">
                          {(() => {
                            const actStatus = computeStatusFromProgress(
                              Number(row.persenSelesai || 0)
                            );
                            return (
                              <Badge
                                className={`${statusColors[actStatus]} border`}
                              >
                                {actStatus}
                              </Badge>
                            );
                          })()}
                        </td>
                        <td className="p-2 align-top">
                          <div className="w-full rounded border px-2 py-1 bg-gray-50 text-right">
                            {row.bobot}%
                          </div>
                        </td>
                        <td className="p-2 align-top">
                          <input
                            type="date"
                            className="w-full rounded border px-2 py-1"
                            value={row.rencanaMulai}
                            onChange={(e) =>
                              updateActivityRow(
                                row.id,
                                "rencanaMulai",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 align-top">
                          <input
                            type="date"
                            className="w-full rounded border px-2 py-1"
                            value={row.rencanaSelesai}
                            onChange={(e) =>
                              updateActivityRow(
                                row.id,
                                "rencanaSelesai",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 align-top">
                          {daysBetween(row.rencanaMulai, row.rencanaSelesai)}
                        </td>
                        <td className="p-2 align-top">
                          <input
                            type="date"
                            className="w-full rounded border px-2 py-1"
                            value={row.aktualMulai}
                            onChange={(e) =>
                              updateActivityRow(
                                row.id,
                                "aktualMulai",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 align-top">
                          <input
                            type="date"
                            className="w-full rounded border px-2 py-1"
                            value={row.aktualSelesai}
                            onChange={(e) =>
                              updateActivityRow(
                                row.id,
                                "aktualSelesai",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 align-top">
                          <input
                            type="number"
                            className="w-full rounded border px-2 py-1"
                            min={0}
                            max={100}
                            value={row.persenSelesai}
                            onChange={(e) =>
                              updateActivityRow(
                                row.id,
                                "persenSelesai",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditorModal(false);
                    setEditingProject(null);
                    setEditingFields(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 text-white"
                  onClick={() => {
                    // Basic validation: total bobot must equal 100
                    const total = activityRows.reduce(
                      (s, r) => s + Number(r.bobot || 0),
                      0
                    );
                    if (total !== 100) {
                      alert(
                        "Total bobot harus 100%. Perbaiki nilai bobot sebelum menyimpan."
                      );
                      return;
                    }
                    // Merge edited project fields into project and update list
                    if (editingProject && editingFields) {
                      const finalProgress = computedProgress;
                      const updated: ProjectData = {
                        ...editingProject,
                        ...editingFields,
                        // ensure required fields exist with defaults
                        name: editingFields.name ?? editingProject.name,
                        code: editingFields.code ?? editingProject.code,
                        manager:
                          editingFields.manager ?? editingProject.manager,
                        status: computeStatusFromProgress(finalProgress),
                        startDate:
                          editingFields.startDate ?? editingProject.startDate,
                        endDate:
                          editingFields.endDate ?? editingProject.endDate,
                        progress: finalProgress,
                        budget: Number(
                          editingFields.budget ?? editingProject.budget
                        ),
                        description:
                          editingFields.description ??
                          editingProject.description,
                      };
                      updateProject(updated);
                      // briefly highlight the updated project in Kanban so it's obvious where it moved
                      setHighlightedProjectId(updated.id);
                      setTimeout(() => setHighlightedProjectId(null), 3000);
                    }

                    setShowEditorModal(false);
                    setEditingProject(null);
                    setEditingFields(null);
                    showSuccessMessage("Project & activities saved (dummy)");
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
