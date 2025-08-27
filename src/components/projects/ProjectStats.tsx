"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectData } from "@/constants/project-dummy-data";
import { Clock, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";

interface ProjectStatsProps {
  projects: ProjectData[];
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ projects }) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;
  const inProgressProjects = projects.filter(
    (p) => p.status === "In Progress"
  ).length;
  const onHoldProjects = projects.filter((p) => p.status === "On Hold").length;

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const averageProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
        )
      : 0;

  const completionRate =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "On Hold",
      value: onHoldProjects,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Average Progress
            </span>
            <span className="text-sm font-medium">{averageProgress}%</span>
          </div>
          <Progress value={averageProgress} className="w-full" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Completion Rate
            </span>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rp {totalBudget.toLocaleString("id-ID")}
          </div>
          <div className="flex items-center mt-2">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-muted-foreground">
              Total allocated
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStats;
