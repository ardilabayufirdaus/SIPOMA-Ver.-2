"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectData } from "@/constants/project-dummy-data";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

interface ProjectFormProps {
  project?: ProjectData;
  onSave: (project: ProjectData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProjectData>(
    project || {
      id: `proj-${Date.now()}`,
      name: "",
      code: "",
      description: "",
      status: "Planning",
      startDate: "",
      endDate: "",
      budget: 0,
      progress: 0,
      manager: "",
      team: [],
      milestones: [],
      sCurveData: [],
      risks: [],
      kpis: [],
    }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProjectData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const isEditing = !!project;

  useEffect(() => {
    const draftKey = `project-draft-${project?.id || "new"}`;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved && !project) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      // ignore
    }

    const id = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 1200);
      } catch (e) {
        console.error(e);
      }
    }, 1000);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProjectData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.code.trim()) newErrors.code = "Project code is required";
    else if (!/^[A-Z0-9\-]{3,}$/i.test(formData.code))
      newErrors.code = "Invalid project code";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (new Date(formData.endDate) <= new Date(formData.startDate))
      newErrors.endDate = "End date must be after start date";
    if (formData.budget <= 0)
      newErrors.budget = "Budget must be greater than 0";
    if (!formData.manager.trim())
      newErrors.manager = "Project manager is required";
    if (formData.progress < 0 || formData.progress > 100)
      newErrors.progress = "Progress must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      onSave(formData);
      localStorage.removeItem(`project-draft-${project?.id || "new"}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err) {
      setErrors({ name: "Failed to save project" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof ProjectData,
    value: ProjectData[keyof ProjectData]
  ) => {
    if (field === "status" && typeof value === "string") {
      const newStatus = value as string;
      if (
        (newStatus === "Completed" || newStatus === "Cancelled") &&
        project &&
        project.status !== newStatus
      ) {
        const ok = window.confirm(
          `Change status to "${newStatus}"? This may be final.`
        );
        if (!ok) return;
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value } as ProjectData));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border border-gray-100 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Project" : "Create New Project"}
            </span>
            {draftSaved && (
              <Badge variant="secondary" className="text-xs text-gray-700">
                Draft saved
              </Badge>
            )}
          </div>
          {isEditing && (
            <Badge variant="secondary" className="text-xs text-gray-700">
              Editing: {project?.name}
            </Badge>
          )}
        </CardTitle>

        {showSuccess && (
          <div className="flex items-center space-x-2 text-white bg-green-600 p-3 rounded-md">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">
              {isEditing ? "Updated" : "Created"} successfully
            </span>
          </div>
        )}

        {errors.name && (
          <div className="flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{errors.name}</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                autoFocus
                required
                className="border-gray-200 focus-ring-red transition-smooth"
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Code *</label>
              <Input
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="e.g., PROJ-2025-001"
                required
              />
              {errors.code && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Manager *</label>
              <Input
                value={formData.manager}
                onChange={(e) => handleChange("manager", e.target.value)}
                required
              />
              {errors.manager && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.manager}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Progress (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.progress}
                onChange={(e) =>
                  handleChange("progress", parseInt(e.target.value || "0", 10))
                }
                className="focus-ring-red transition-smooth"
              />
              {errors.progress && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.progress}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date *</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date *</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Budget *</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={formData.budget}
                onChange={(e) =>
                  handleChange("budget", parseFloat(e.target.value || "0"))
                }
                required
              />
              {errors.budget && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.budget}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-200 bg-white rounded-md focus:ring-2 focus:ring-red-50"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] bg-red-600 text-white hover:bg-red-700 tap-target transition-smooth"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Update Project" : "Create Project"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
