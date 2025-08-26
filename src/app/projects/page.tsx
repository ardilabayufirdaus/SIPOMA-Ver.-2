"use client";

import React from "react";
import ProjectList from "@/components/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>
      <p className="text-sm text-gray-600 mb-4">
        Create and manage projects used across SIPOMA.
      </p>
      <ProjectList />
    </div>
  );
}
