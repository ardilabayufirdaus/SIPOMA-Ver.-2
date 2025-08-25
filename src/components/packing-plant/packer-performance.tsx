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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PackerMetrics {
  packer_id: string;
  operator_name: string;
  shift: "morning" | "afternoon" | "night";
  bags_packed_today: number;
  bags_packed_hour: number;
  efficiency_rate: number;
  quality_score: number;
  downtime_minutes: number;
  error_rate: number;
  speed_consistency: number;
  maintenance_score: number;
  safety_incidents: number;
  energy_consumption: number;
  cost_per_bag: number;
  experience_years: number;
  certification_level: "basic" | "intermediate" | "advanced" | "expert";
}

interface PerformanceComparison {
  metric: string;
  current_shift: number;
  previous_shift: number;
  week_average: number;
  month_average: number;
  target: number;
}

interface SkillAssessment {
  operator_name: string;
  technical_skills: number;
  speed_proficiency: number;
  quality_focus: number;
  safety_awareness: number;
  problem_solving: number;
  teamwork: number;
  overall_rating: number;
  improvement_areas: string[];
  strengths: string[];
}

interface TrainingProgram {
  program_id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  completion_rate: number;
  skill_improvement: number;
  cost_per_participant: number;
  next_session: string;
  certification: boolean;
}

const PackerPerformance = () => {
  const [packerMetrics, setPackerMetrics] = useState<PackerMetrics[]>([]);
  const [performanceComparison, setPerformanceComparison] = useState<
    PerformanceComparison[]
  >([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>(
    []
  );
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(
    []
  );
  const [selectedView, setSelectedView] = useState<
    "performance" | "skills" | "training" | "analytics"
  >("performance");
  const [selectedShift, setSelectedShift] = useState<
    "all" | "morning" | "afternoon" | "night"
  >("all");

  // Simulate real-time packer performance data
  useEffect(() => {
    const generatePackerMetrics = (): PackerMetrics[] => {
      const names = [
        "Budi Santoso",
        "Siti Rahayu",
        "Ahmad Fadil",
        "Dewi Lestari",
        "Joko Susilo",
        "Rani Permata",
        "Agus Wijaya",
        "Indah Sari",
        "Hendro Gunawan",
        "Maya Putri",
        "Eko Prasetyo",
        "Nina Kartika",
      ];

      const shifts: PackerMetrics["shift"][] = [
        "morning",
        "afternoon",
        "night",
      ];
      const certifications: PackerMetrics["certification_level"][] = [
        "basic",
        "intermediate",
        "advanced",
        "expert",
      ];

      return Array.from({ length: 12 }, (_, i) => ({
        packer_id: `PKR-${String(i + 1).padStart(3, "0")}`,
        operator_name: names[i],
        shift: shifts[i % 3],
        bags_packed_today: 800 + Math.floor(Math.random() * 400),
        bags_packed_hour: 100 + Math.floor(Math.random() * 50),
        efficiency_rate: 75 + Math.random() * 20,
        quality_score: 85 + Math.random() * 12,
        downtime_minutes: Math.floor(Math.random() * 45),
        error_rate: Math.random() * 3,
        speed_consistency: 80 + Math.random() * 15,
        maintenance_score: 85 + Math.random() * 10,
        safety_incidents: Math.floor(Math.random() * 2),
        energy_consumption: 15 + Math.random() * 8,
        cost_per_bag: 0.45 + Math.random() * 0.15,
        experience_years: 1 + Math.floor(Math.random() * 15),
        certification_level:
          certifications[Math.floor(Math.random() * certifications.length)],
      }));
    };

    const generatePerformanceComparison = (): PerformanceComparison[] => [
      {
        metric: "Bags per Hour",
        current_shift: 125,
        previous_shift: 118,
        week_average: 122,
        month_average: 119,
        target: 130,
      },
      {
        metric: "Efficiency Rate (%)",
        current_shift: 87.5,
        previous_shift: 84.2,
        week_average: 86.1,
        month_average: 85.3,
        target: 90,
      },
      {
        metric: "Quality Score (%)",
        current_shift: 92.8,
        previous_shift: 91.5,
        week_average: 92.2,
        month_average: 91.8,
        target: 95,
      },
      {
        metric: "Downtime (minutes)",
        current_shift: 18,
        previous_shift: 25,
        week_average: 22,
        month_average: 24,
        target: 15,
      },
      {
        metric: "Error Rate (%)",
        current_shift: 1.2,
        previous_shift: 1.8,
        week_average: 1.5,
        month_average: 1.7,
        target: 1.0,
      },
    ];

    const generateSkillAssessments = (): SkillAssessment[] => {
      const names = [
        "Budi Santoso",
        "Siti Rahayu",
        "Ahmad Fadil",
        "Dewi Lestari",
        "Joko Susilo",
        "Rani Permata",
        "Agus Wijaya",
        "Indah Sari",
      ];

      return names.map((name) => ({
        operator_name: name,
        technical_skills: 70 + Math.random() * 25,
        speed_proficiency: 75 + Math.random() * 20,
        quality_focus: 80 + Math.random() * 15,
        safety_awareness: 85 + Math.random() * 12,
        problem_solving: 65 + Math.random() * 30,
        teamwork: 80 + Math.random() * 18,
        overall_rating: 75 + Math.random() * 20,
        improvement_areas: [
          "Speed optimization",
          "Quality control",
          "Equipment maintenance",
          "Safety protocols",
          "Team communication",
          "Technical skills",
        ].slice(0, 2 + Math.floor(Math.random() * 2)),
        strengths: [
          "Consistent performance",
          "High quality output",
          "Safety conscious",
          "Team collaboration",
          "Quick learner",
          "Problem solver",
        ].slice(0, 2 + Math.floor(Math.random() * 2)),
      }));
    };

    const generateTrainingPrograms = (): TrainingProgram[] => [
      {
        program_id: "TRN-001",
        title: "Advanced Packing Techniques",
        description:
          "Master advanced packing methods for improved speed and quality",
        duration: "3 days",
        participants: 8,
        completion_rate: 92.5,
        skill_improvement: 18.5,
        cost_per_participant: 750000,
        next_session: "2024-01-22",
        certification: true,
      },
      {
        program_id: "TRN-002",
        title: "Equipment Maintenance & Troubleshooting",
        description: "Learn preventive maintenance and basic troubleshooting",
        duration: "2 days",
        participants: 12,
        completion_rate: 87.3,
        skill_improvement: 22.1,
        cost_per_participant: 500000,
        next_session: "2024-01-25",
        certification: true,
      },
      {
        program_id: "TRN-003",
        title: "Safety & Quality Standards",
        description: "Comprehensive safety protocols and quality assurance",
        duration: "1 day",
        participants: 15,
        completion_rate: 96.8,
        skill_improvement: 15.3,
        cost_per_participant: 350000,
        next_session: "2024-01-20",
        certification: false,
      },
      {
        program_id: "TRN-004",
        title: "Leadership Development",
        description: "Develop leadership skills for senior operators",
        duration: "5 days",
        participants: 6,
        completion_rate: 89.2,
        skill_improvement: 28.7,
        cost_per_participant: 1200000,
        next_session: "2024-02-01",
        certification: true,
      },
    ];

    // Initial data
    setPackerMetrics(generatePackerMetrics());
    setPerformanceComparison(generatePerformanceComparison());
    setSkillAssessments(generateSkillAssessments());
    setTrainingPrograms(generateTrainingPrograms());

    // Update every 2 minutes
    const interval = setInterval(() => {
      setPackerMetrics(generatePackerMetrics());
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const getCertificationColor = (level: string) => {
    switch (level) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-green-100 text-green-800";
      case "expert":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (
    value: number,
    target: number,
    isReverse = false
  ) => {
    const ratio = value / target;
    if (isReverse) {
      // For metrics where lower is better (downtime, error rate)
      if (ratio <= 0.8) return "text-green-600";
      if (ratio <= 1.0) return "text-yellow-600";
      return "text-red-600";
    } else {
      // For metrics where higher is better
      if (ratio >= 0.95) return "text-green-600";
      if (ratio >= 0.85) return "text-yellow-600";
      return "text-red-600";
    }
  };

  const getSkillLevel = (score: number) => {
    if (score >= 90) return { level: "Expert", color: "text-purple-600" };
    if (score >= 80) return { level: "Advanced", color: "text-green-600" };
    if (score >= 70) return { level: "Intermediate", color: "text-blue-600" };
    return { level: "Basic", color: "text-gray-600" };
  };

  // Filter data based on selected shift
  const filteredPackers =
    selectedShift === "all"
      ? packerMetrics
      : packerMetrics.filter((p) => p.shift === selectedShift);

  // Chart data
  const performanceComparisonData = performanceComparison.map((item) => ({
    metric: item.metric.replace(" (%)", "").replace(" (minutes)", ""),
    current: item.current_shift,
    previous: item.previous_shift,
    average: item.week_average,
    target: item.target,
  }));

  const shiftPerformanceData = [
    {
      shift: "Morning",
      efficiency:
        packerMetrics
          .filter((p) => p.shift === "morning")
          .reduce((sum, p) => sum + p.efficiency_rate, 0) /
          packerMetrics.filter((p) => p.shift === "morning").length || 0,
      quality:
        packerMetrics
          .filter((p) => p.shift === "morning")
          .reduce((sum, p) => sum + p.quality_score, 0) /
          packerMetrics.filter((p) => p.shift === "morning").length || 0,
      speed:
        packerMetrics
          .filter((p) => p.shift === "morning")
          .reduce((sum, p) => sum + p.bags_packed_hour, 0) /
          packerMetrics.filter((p) => p.shift === "morning").length || 0,
    },
    {
      shift: "Afternoon",
      efficiency:
        packerMetrics
          .filter((p) => p.shift === "afternoon")
          .reduce((sum, p) => sum + p.efficiency_rate, 0) /
          packerMetrics.filter((p) => p.shift === "afternoon").length || 0,
      quality:
        packerMetrics
          .filter((p) => p.shift === "afternoon")
          .reduce((sum, p) => sum + p.quality_score, 0) /
          packerMetrics.filter((p) => p.shift === "afternoon").length || 0,
      speed:
        packerMetrics
          .filter((p) => p.shift === "afternoon")
          .reduce((sum, p) => sum + p.bags_packed_hour, 0) /
          packerMetrics.filter((p) => p.shift === "afternoon").length || 0,
    },
    {
      shift: "Night",
      efficiency:
        packerMetrics
          .filter((p) => p.shift === "night")
          .reduce((sum, p) => sum + p.efficiency_rate, 0) /
          packerMetrics.filter((p) => p.shift === "night").length || 0,
      quality:
        packerMetrics
          .filter((p) => p.shift === "night")
          .reduce((sum, p) => sum + p.quality_score, 0) /
          packerMetrics.filter((p) => p.shift === "night").length || 0,
      speed:
        packerMetrics
          .filter((p) => p.shift === "night")
          .reduce((sum, p) => sum + p.bags_packed_hour, 0) /
          packerMetrics.filter((p) => p.shift === "night").length || 0,
    },
  ];

  const topPerformers = [...filteredPackers]
    .sort((a, b) => b.efficiency_rate - a.efficiency_rate)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Packer Performance
          </h2>
          <p className="text-gray-600">
            Individual performance tracking and skill development
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning Shift</option>
            <option value="afternoon">Afternoon Shift</option>
            <option value="night">Night Shift</option>
          </select>
          {[
            { id: "performance", label: "Performance", icon: "📊" },
            { id: "skills", label: "Skills", icon: "🎯" },
            { id: "training", label: "Training", icon: "📚" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedView === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView(tab.id as any)}
              className={
                selectedView === tab.id ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      {selectedView === "performance" && (
        <div className="space-y-6">
          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🏆 Top Performers -{" "}
              {selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPerformers.map((packer, index) => (
                <Card
                  key={packer.packer_id}
                  className={`p-4 ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
                      : ""
                  }`}
                >
                  <div className="text-center">
                    {index === 0 && <div className="text-2xl mb-2">👑</div>}
                    <h4 className="font-medium text-gray-900">
                      {packer.operator_name}
                    </h4>
                    <p className="text-sm text-gray-600">{packer.packer_id}</p>
                    <div className="mt-3 space-y-2">
                      <div className="text-lg font-bold text-blue-600">
                        {packer.efficiency_rate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                      <Badge
                        className={getCertificationColor(
                          packer.certification_level
                        )}
                      >
                        {packer.certification_level}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Individual Performance Cards */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Individual Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackers.map((packer) => (
                <Card
                  key={packer.packer_id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {packer.operator_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {packer.packer_id} • {packer.shift}
                      </p>
                    </div>
                    <Badge
                      className={getCertificationColor(
                        packer.certification_level
                      )}
                    >
                      {packer.certification_level}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Bags Today:</span>
                        <p className="font-medium">
                          {packer.bags_packed_today}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Bags/Hour:</span>
                        <p className="font-medium">{packer.bags_packed_hour}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Efficiency:</span>
                        <p className="font-medium text-blue-600">
                          {packer.efficiency_rate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality:</span>
                        <p className="font-medium text-green-600">
                          {packer.quality_score.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Downtime:</span>
                        <p className="font-medium text-orange-600">
                          {packer.downtime_minutes}m
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Error Rate:</span>
                        <p className="font-medium text-red-600">
                          {packer.error_rate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">
                          {packer.experience_years} years
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cost/Bag:</span>
                        <span className="font-medium">
                          Rp {(packer.cost_per_bag * 1000).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Performance Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#dc2626" name="Current Shift" />
                <Bar dataKey="previous" fill="#f59e0b" name="Previous Shift" />
                <Bar dataKey="average" fill="#3b82f6" name="Week Average" />
                <Bar dataKey="target" fill="#10b981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Skills Assessment */}
      {selectedView === "skills" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Skill Assessment Overview
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {skillAssessments.slice(0, 6).map((assessment) => (
                <Card key={assessment.operator_name} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {assessment.operator_name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          Overall Rating:
                        </span>
                        <span
                          className={`font-medium ${
                            getSkillLevel(assessment.overall_rating).color
                          }`}
                        >
                          {assessment.overall_rating.toFixed(1)}%
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            getSkillLevel(assessment.overall_rating).color
                          }
                        >
                          {getSkillLevel(assessment.overall_rating).level}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart
                        data={[
                          {
                            skill: "Technical",
                            value: assessment.technical_skills,
                          },
                          {
                            skill: "Speed",
                            value: assessment.speed_proficiency,
                          },
                          { skill: "Quality", value: assessment.quality_focus },
                          {
                            skill: "Safety",
                            value: assessment.safety_awareness,
                          },
                          {
                            skill: "Problem\nSolving",
                            value: assessment.problem_solving,
                          },
                          { skill: "Teamwork", value: assessment.teamwork },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={0} domain={[0, 100]} />
                        <Radar
                          dataKey="value"
                          stroke="#dc2626"
                          fill="#dc2626"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        💪 Strengths
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {assessment.strengths.map((strength, index) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        🎯 Improvement Areas
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {assessment.improvement_areas.map((area, index) => (
                          <li key={index}>• {area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Training Programs */}
      {selectedView === "training" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              📚 Training Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainingPrograms.map((program) => (
                <Card
                  key={program.program_id}
                  className="p-6 bg-gradient-to-r from-blue-50 to-purple-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {program.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {program.description}
                      </p>
                    </div>
                    {program.certification && (
                      <Badge className="bg-purple-100 text-purple-800">
                        🏆 Certified
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{program.duration}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <p className="font-medium">{program.participants}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Completion Rate:</span>
                      <p className="font-medium text-green-600">
                        {program.completion_rate}%
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Skill Improvement:</span>
                      <p className="font-medium text-blue-600">
                        +{program.skill_improvement}%
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Cost per Person:</span>
                      <p className="font-medium">
                        Rp {(program.cost_per_participant / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Next Session:</span>
                      <p className="font-medium text-red-600">
                        {program.next_session}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      📝 Enroll Operators
                    </Button>
                    <Button size="sm" variant="outline">
                      📊 View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Analytics */}
      {selectedView === "analytics" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shift Performance Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={shiftPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shift" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#dc2626" name="Efficiency %" />
                <Bar dataKey="quality" fill="#10b981" name="Quality %" />
                <Bar dataKey="speed" fill="#3b82f6" name="Speed (bags/h)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Certification Distribution
              </h4>
              <div className="space-y-3">
                {["expert", "advanced", "intermediate", "basic"].map(
                  (level) => {
                    const count = packerMetrics.filter(
                      (p) => p.certification_level === level
                    ).length;
                    const percentage = (count / packerMetrics.length) * 100;
                    return (
                      <div
                        key={level}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium capitalize">
                          {level}:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                level === "expert"
                                  ? "bg-purple-500"
                                  : level === "advanced"
                                  ? "bg-green-500"
                                  : level === "intermediate"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Performance Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Efficiency:</span>
                  <span className="font-medium text-blue-600">
                    {(
                      filteredPackers.reduce(
                        (sum, p) => sum + p.efficiency_rate,
                        0
                      ) / filteredPackers.length
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Quality:</span>
                  <span className="font-medium text-green-600">
                    {(
                      filteredPackers.reduce(
                        (sum, p) => sum + p.quality_score,
                        0
                      ) / filteredPackers.length
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Output:</span>
                  <span className="font-medium text-red-600">
                    {filteredPackers
                      .reduce((sum, p) => sum + p.bags_packed_today, 0)
                      .toLocaleString()}{" "}
                    bags
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Experience:</span>
                  <span className="font-medium text-purple-600">
                    {(
                      filteredPackers.reduce(
                        (sum, p) => sum + p.experience_years,
                        0
                      ) / filteredPackers.length
                    ).toFixed(1)}{" "}
                    years
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Training ROI</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Programs Active:
                  </span>
                  <span className="font-medium">{trainingPrograms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Total Participants:
                  </span>
                  <span className="font-medium">
                    {trainingPrograms.reduce(
                      (sum, p) => sum + p.participants,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Completion:</span>
                  <span className="font-medium text-green-600">
                    {(
                      trainingPrograms.reduce(
                        (sum, p) => sum + p.completion_rate,
                        0
                      ) / trainingPrograms.length
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Improvement:
                  </span>
                  <span className="font-medium text-blue-600">
                    +
                    {(
                      trainingPrograms.reduce(
                        (sum, p) => sum + p.skill_improvement,
                        0
                      ) / trainingPrograms.length
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🤖 AI Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🎯 Performance Opportunity
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Night shift shows 12% lower efficiency. Consider additional
                training or incentive programs.
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Design Intervention
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                📚 Training Recommendation
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                5 operators would benefit from advanced packing techniques
                training based on performance patterns.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Schedule Training
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                💡 Skill Development
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Cross-training high performers as mentors could improve overall
                team efficiency by 8-15%.
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Mentor Program
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                🏆 Recognition Opportunity
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Top 3 performers consistently exceed targets. Consider
                recognition program to maintain motivation.
              </p>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Recognition Program
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PackerPerformance;
