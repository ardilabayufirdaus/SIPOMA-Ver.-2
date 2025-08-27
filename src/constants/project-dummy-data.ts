// Dummy data untuk Projects dengan S-Curve
export interface ProjectData {
  id: string;
  name: string;
  code: string;
  description: string;
  status: "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
  startDate: string;
  endDate: string;
  budget: number;
  progress: number; // 0-100
  manager: string;
  team: string[];
  milestones: {
    id: string;
    name: string;
    date: string;
    completed: boolean;
    progress: number;
  }[];
  sCurveData: {
    week: number;
    planned: number;
    actual: number;
    cumulativePlanned: number;
    cumulativeActual: number;
  }[];
  risks: {
    id: string;
    description: string;
    severity: "Low" | "Medium" | "High";
    status: "Open" | "Mitigated" | "Closed";
  }[];
  kpis: {
    name: string;
    target: number;
    actual: number;
    unit: string;
  }[];
}

export const projectsDummyData: ProjectData[] = [
  {
    id: "1",
    name: "Modernisasi Pabrik Semen Tuban",
    code: "PROJ-2025-001",
    description:
      "Proyek modernisasi pabrik semen dengan teknologi terbaru untuk meningkatkan efisiensi produksi",
    status: "In Progress",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    budget: 50000000000, // 50M IDR
    progress: 35,
    manager: "Ahmad Surya",
    team: [
      "Ahmad Surya",
      "Budi Santoso",
      "Citra Dewi",
      "Dedi Kurniawan",
      "Eka Putri",
    ],
    milestones: [
      {
        id: "m1",
        name: "Kick-off Meeting",
        date: "2025-01-20",
        completed: true,
        progress: 100,
      },
      {
        id: "m2",
        name: "Design Review",
        date: "2025-03-15",
        completed: true,
        progress: 100,
      },
      {
        id: "m3",
        name: "Procurement",
        date: "2025-06-30",
        completed: false,
        progress: 60,
      },
      {
        id: "m4",
        name: "Installation",
        date: "2025-09-30",
        completed: false,
        progress: 20,
      },
      {
        id: "m5",
        name: "Testing & Commissioning",
        date: "2025-11-30",
        completed: false,
        progress: 0,
      },
      {
        id: "m6",
        name: "Go-live",
        date: "2025-12-15",
        completed: false,
        progress: 0,
      },
    ],
    sCurveData: [
      {
        week: 1,
        planned: 2,
        actual: 2,
        cumulativePlanned: 2,
        cumulativeActual: 2,
      },
      {
        week: 2,
        planned: 3,
        actual: 3,
        cumulativePlanned: 5,
        cumulativeActual: 5,
      },
      {
        week: 3,
        planned: 4,
        actual: 4,
        cumulativePlanned: 9,
        cumulativeActual: 9,
      },
      {
        week: 4,
        planned: 5,
        actual: 5,
        cumulativePlanned: 14,
        cumulativeActual: 14,
      },
      {
        week: 5,
        planned: 6,
        actual: 6,
        cumulativePlanned: 20,
        cumulativeActual: 20,
      },
      {
        week: 6,
        planned: 7,
        actual: 7,
        cumulativePlanned: 27,
        cumulativeActual: 27,
      },
      {
        week: 7,
        planned: 8,
        actual: 8,
        cumulativePlanned: 35,
        cumulativeActual: 35,
      },
      {
        week: 8,
        planned: 9,
        actual: 9,
        cumulativePlanned: 44,
        cumulativeActual: 44,
      },
      {
        week: 9,
        planned: 10,
        actual: 8,
        cumulativePlanned: 54,
        cumulativeActual: 52,
      },
      {
        week: 10,
        planned: 11,
        actual: 9,
        cumulativePlanned: 65,
        cumulativeActual: 61,
      },
      {
        week: 11,
        planned: 12,
        actual: 10,
        cumulativePlanned: 77,
        cumulativeActual: 71,
      },
      {
        week: 12,
        planned: 13,
        actual: 11,
        cumulativePlanned: 90,
        cumulativeActual: 82,
      },
      {
        week: 13,
        planned: 14,
        actual: 12,
        cumulativePlanned: 104,
        cumulativeActual: 94,
      },
      {
        week: 14,
        planned: 15,
        actual: 13,
        cumulativePlanned: 119,
        cumulativeActual: 107,
      },
      {
        week: 15,
        planned: 16,
        actual: 14,
        cumulativePlanned: 135,
        cumulativeActual: 121,
      },
      {
        week: 16,
        planned: 17,
        actual: 15,
        cumulativePlanned: 152,
        cumulativeActual: 136,
      },
      {
        week: 17,
        planned: 18,
        actual: 16,
        cumulativePlanned: 170,
        cumulativeActual: 152,
      },
      {
        week: 18,
        planned: 19,
        actual: 17,
        cumulativePlanned: 189,
        cumulativeActual: 169,
      },
      {
        week: 19,
        planned: 20,
        actual: 18,
        cumulativePlanned: 209,
        cumulativeActual: 187,
      },
      {
        week: 20,
        planned: 21,
        actual: 19,
        cumulativePlanned: 230,
        cumulativeActual: 206,
      },
      {
        week: 21,
        planned: 22,
        actual: 20,
        cumulativePlanned: 252,
        cumulativeActual: 226,
      },
      {
        week: 22,
        planned: 23,
        actual: 21,
        cumulativePlanned: 275,
        cumulativeActual: 247,
      },
      {
        week: 23,
        planned: 24,
        actual: 22,
        cumulativePlanned: 299,
        cumulativeActual: 269,
      },
      {
        week: 24,
        planned: 25,
        actual: 23,
        cumulativePlanned: 324,
        cumulativeActual: 292,
      },
      {
        week: 25,
        planned: 26,
        actual: 24,
        cumulativePlanned: 350,
        cumulativeActual: 316,
      },
      {
        week: 26,
        planned: 27,
        actual: 25,
        cumulativePlanned: 377,
        cumulativeActual: 341,
      },
      {
        week: 27,
        planned: 28,
        actual: 26,
        cumulativePlanned: 405,
        cumulativeActual: 367,
      },
      {
        week: 28,
        planned: 29,
        actual: 27,
        cumulativePlanned: 434,
        cumulativeActual: 394,
      },
      {
        week: 29,
        planned: 30,
        actual: 28,
        cumulativePlanned: 464,
        cumulativeActual: 422,
      },
      {
        week: 30,
        planned: 31,
        actual: 29,
        cumulativePlanned: 495,
        cumulativeActual: 451,
      },
      {
        week: 31,
        planned: 32,
        actual: 30,
        cumulativePlanned: 527,
        cumulativeActual: 481,
      },
      {
        week: 32,
        planned: 33,
        actual: 31,
        cumulativePlanned: 560,
        cumulativeActual: 512,
      },
      {
        week: 33,
        planned: 34,
        actual: 32,
        cumulativePlanned: 594,
        cumulativeActual: 544,
      },
      {
        week: 34,
        planned: 35,
        actual: 33,
        cumulativePlanned: 629,
        cumulativeActual: 577,
      },
      {
        week: 35,
        planned: 36,
        actual: 34,
        cumulativePlanned: 665,
        cumulativeActual: 611,
      },
      {
        week: 36,
        planned: 37,
        actual: 35,
        cumulativePlanned: 702,
        cumulativeActual: 646,
      },
      {
        week: 37,
        planned: 38,
        actual: 36,
        cumulativePlanned: 740,
        cumulativeActual: 682,
      },
      {
        week: 38,
        planned: 39,
        actual: 37,
        cumulativePlanned: 779,
        cumulativeActual: 719,
      },
      {
        week: 39,
        planned: 40,
        actual: 38,
        cumulativePlanned: 819,
        cumulativeActual: 757,
      },
      {
        week: 40,
        planned: 41,
        actual: 39,
        cumulativePlanned: 860,
        cumulativeActual: 796,
      },
      {
        week: 41,
        planned: 42,
        actual: 40,
        cumulativePlanned: 902,
        cumulativeActual: 836,
      },
      {
        week: 42,
        planned: 43,
        actual: 41,
        cumulativePlanned: 945,
        cumulativeActual: 877,
      },
      {
        week: 43,
        planned: 44,
        actual: 42,
        cumulativePlanned: 989,
        cumulativeActual: 919,
      },
      {
        week: 44,
        planned: 45,
        actual: 43,
        cumulativePlanned: 1034,
        cumulativeActual: 962,
      },
      {
        week: 45,
        planned: 46,
        actual: 44,
        cumulativePlanned: 1080,
        cumulativeActual: 1006,
      },
      {
        week: 46,
        planned: 47,
        actual: 45,
        cumulativePlanned: 1127,
        cumulativeActual: 1051,
      },
      {
        week: 47,
        planned: 48,
        actual: 46,
        cumulativePlanned: 1175,
        cumulativeActual: 1097,
      },
      {
        week: 48,
        planned: 49,
        actual: 47,
        cumulativePlanned: 1224,
        cumulativeActual: 1144,
      },
      {
        week: 49,
        planned: 50,
        actual: 48,
        cumulativePlanned: 1274,
        cumulativeActual: 1192,
      },
      {
        week: 50,
        planned: 51,
        actual: 49,
        cumulativePlanned: 1325,
        cumulativeActual: 1241,
      },
      {
        week: 51,
        planned: 52,
        actual: 50,
        cumulativePlanned: 1377,
        cumulativeActual: 1291,
      },
      {
        week: 52,
        planned: 53,
        actual: 51,
        cumulativePlanned: 1430,
        cumulativeActual: 1342,
      },
    ],
    risks: [
      {
        id: "r1",
        description: "Keterlambatan delivery equipment dari supplier",
        severity: "High",
        status: "Mitigated",
      },
      {
        id: "r2",
        description: "Fluktuasi harga bahan baku",
        severity: "Medium",
        status: "Open",
      },
      {
        id: "r3",
        description: "Kurangnya tenaga ahli lokal",
        severity: "Medium",
        status: "Mitigated",
      },
      {
        id: "r4",
        description: "Perubahan regulasi lingkungan",
        severity: "Low",
        status: "Open",
      },
    ],
    kpis: [
      { name: "Budget Variance", target: 5, actual: 3.2, unit: "%" },
      { name: "Schedule Variance", target: 10, actual: 8.5, unit: "%" },
      { name: "Quality Score", target: 95, actual: 92, unit: "%" },
      { name: "Safety Incidents", target: 0, actual: 0, unit: "incidents" },
    ],
  },
  {
    id: "2",
    name: "Optimalisasi Supply Chain",
    code: "PROJ-2025-002",
    description:
      "Proyek optimalisasi rantai pasok untuk mengurangi biaya logistik dan meningkatkan efisiensi distribusi",
    status: "Planning",
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    budget: 15000000000, // 15M IDR
    progress: 15,
    manager: "Sari Indah",
    team: ["Sari Indah", "Rudi Hartono", "Maya Sari", "Agus Wijaya"],
    milestones: [
      {
        id: "m1",
        name: "Requirement Gathering",
        date: "2025-03-15",
        completed: true,
        progress: 100,
      },
      {
        id: "m2",
        name: "Process Mapping",
        date: "2025-04-30",
        completed: false,
        progress: 70,
      },
      {
        id: "m3",
        name: "Solution Design",
        date: "2025-06-15",
        completed: false,
        progress: 30,
      },
      {
        id: "m4",
        name: "Implementation",
        date: "2025-08-15",
        completed: false,
        progress: 0,
      },
    ],
    sCurveData: [
      {
        week: 1,
        planned: 5,
        actual: 5,
        cumulativePlanned: 5,
        cumulativeActual: 5,
      },
      {
        week: 2,
        planned: 8,
        actual: 8,
        cumulativePlanned: 13,
        cumulativeActual: 13,
      },
      {
        week: 3,
        planned: 12,
        actual: 12,
        cumulativePlanned: 25,
        cumulativeActual: 25,
      },
      {
        week: 4,
        planned: 15,
        actual: 15,
        cumulativePlanned: 40,
        cumulativeActual: 40,
      },
      {
        week: 5,
        planned: 18,
        actual: 18,
        cumulativePlanned: 58,
        cumulativeActual: 58,
      },
      {
        week: 6,
        planned: 20,
        actual: 20,
        cumulativePlanned: 78,
        cumulativeActual: 78,
      },
      {
        week: 7,
        planned: 22,
        actual: 22,
        cumulativePlanned: 100,
        cumulativeActual: 100,
      },
    ],
    risks: [
      {
        id: "r1",
        description: "Resistensi dari stakeholder internal",
        severity: "Medium",
        status: "Open",
      },
      {
        id: "r2",
        description: "Kompleksitas integrasi sistem",
        severity: "High",
        status: "Open",
      },
    ],
    kpis: [
      { name: "Cost Reduction", target: 20, actual: 0, unit: "%" },
      { name: "Process Efficiency", target: 30, actual: 0, unit: "%" },
    ],
  },
  {
    id: "3",
    name: "Digitalisasi Quality Control",
    code: "PROJ-2025-003",
    description:
      "Implementasi sistem digital untuk kontrol kualitas produk semen dengan AI dan machine learning",
    status: "Completed",
    startDate: "2024-09-01",
    endDate: "2025-02-28",
    budget: 25000000000, // 25M IDR
    progress: 100,
    manager: "Dr. Hendro Wicaksono",
    team: [
      "Dr. Hendro Wicaksono",
      "Lina Marlina",
      "Fajar Nugroho",
      "Rina Sari",
      "Bambang Sudirman",
    ],
    milestones: [
      {
        id: "m1",
        name: "AI Model Development",
        date: "2024-11-30",
        completed: true,
        progress: 100,
      },
      {
        id: "m2",
        name: "System Integration",
        date: "2025-01-15",
        completed: true,
        progress: 100,
      },
      {
        id: "m3",
        name: "User Training",
        date: "2025-02-15",
        completed: true,
        progress: 100,
      },
      {
        id: "m4",
        name: "Go-live & Handover",
        date: "2025-02-28",
        completed: true,
        progress: 100,
      },
    ],
    sCurveData: [
      {
        week: 1,
        planned: 3,
        actual: 3,
        cumulativePlanned: 3,
        cumulativeActual: 3,
      },
      {
        week: 2,
        planned: 5,
        actual: 5,
        cumulativePlanned: 8,
        cumulativeActual: 8,
      },
      {
        week: 3,
        planned: 8,
        actual: 8,
        cumulativePlanned: 16,
        cumulativeActual: 16,
      },
      {
        week: 4,
        planned: 12,
        actual: 12,
        cumulativePlanned: 28,
        cumulativeActual: 28,
      },
      {
        week: 5,
        planned: 15,
        actual: 15,
        cumulativePlanned: 43,
        cumulativeActual: 43,
      },
      {
        week: 6,
        planned: 18,
        actual: 18,
        cumulativePlanned: 61,
        cumulativeActual: 61,
      },
      {
        week: 7,
        planned: 20,
        actual: 20,
        cumulativePlanned: 81,
        cumulativeActual: 81,
      },
      {
        week: 8,
        planned: 22,
        actual: 22,
        cumulativePlanned: 103,
        cumulativeActual: 103,
      },
      {
        week: 9,
        planned: 25,
        actual: 25,
        cumulativePlanned: 128,
        cumulativeActual: 128,
      },
      {
        week: 10,
        planned: 28,
        actual: 28,
        cumulativePlanned: 156,
        cumulativeActual: 156,
      },
      {
        week: 11,
        planned: 30,
        actual: 30,
        cumulativePlanned: 186,
        cumulativeActual: 186,
      },
      {
        week: 12,
        planned: 32,
        actual: 32,
        cumulativePlanned: 218,
        cumulativeActual: 218,
      },
      {
        week: 13,
        planned: 35,
        actual: 35,
        cumulativePlanned: 253,
        cumulativeActual: 253,
      },
      {
        week: 14,
        planned: 38,
        actual: 38,
        cumulativePlanned: 291,
        cumulativeActual: 291,
      },
      {
        week: 15,
        planned: 40,
        actual: 40,
        cumulativePlanned: 331,
        cumulativeActual: 331,
      },
      {
        week: 16,
        planned: 42,
        actual: 42,
        cumulativePlanned: 373,
        cumulativeActual: 373,
      },
      {
        week: 17,
        planned: 45,
        actual: 45,
        cumulativePlanned: 418,
        cumulativeActual: 418,
      },
      {
        week: 18,
        planned: 48,
        actual: 48,
        cumulativePlanned: 466,
        cumulativeActual: 466,
      },
      {
        week: 19,
        planned: 50,
        actual: 50,
        cumulativePlanned: 516,
        cumulativeActual: 516,
      },
      {
        week: 20,
        planned: 52,
        actual: 52,
        cumulativePlanned: 568,
        cumulativeActual: 568,
      },
      {
        week: 21,
        planned: 55,
        actual: 55,
        cumulativePlanned: 623,
        cumulativeActual: 623,
      },
      {
        week: 22,
        planned: 58,
        actual: 58,
        cumulativePlanned: 681,
        cumulativeActual: 681,
      },
      {
        week: 23,
        planned: 60,
        actual: 60,
        cumulativePlanned: 741,
        cumulativeActual: 741,
      },
      {
        week: 24,
        planned: 62,
        actual: 62,
        cumulativePlanned: 803,
        cumulativeActual: 803,
      },
      {
        week: 25,
        planned: 65,
        actual: 65,
        cumulativePlanned: 868,
        cumulativeActual: 868,
      },
      {
        week: 26,
        planned: 68,
        actual: 68,
        cumulativePlanned: 936,
        cumulativeActual: 936,
      },
    ],
    risks: [
      {
        id: "r1",
        description: "Data quality issues",
        severity: "Medium",
        status: "Closed",
      },
      {
        id: "r2",
        description: "Integration complexity",
        severity: "High",
        status: "Closed",
      },
    ],
    kpis: [
      { name: "Defect Reduction", target: 25, actual: 32, unit: "%" },
      { name: "Inspection Time", target: 40, actual: 45, unit: "%" },
      { name: "Accuracy Rate", target: 98, actual: 97.5, unit: "%" },
    ],
  },
  {
    id: "4",
    name: "Green Energy Initiative",
    code: "PROJ-2025-004",
    description:
      "Transisi ke energi hijau dengan instalasi panel surya dan sistem energi terbarukan",
    status: "On Hold",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    budget: 75000000000, // 75M IDR
    progress: 5,
    manager: "Prof. Rina Wijaya",
    team: [
      "Prof. Rina Wijaya",
      "Ahmad Fauzi",
      "Dewi Lestari",
      "Hendra Gunawan",
      "Maya Putri",
      "Rudi Setiawan",
    ],
    milestones: [
      {
        id: "m1",
        name: "Feasibility Study",
        date: "2025-07-31",
        completed: false,
        progress: 20,
      },
      {
        id: "m2",
        name: "Environmental Assessment",
        date: "2025-09-30",
        completed: false,
        progress: 0,
      },
      {
        id: "m3",
        name: "Equipment Procurement",
        date: "2025-12-31",
        completed: false,
        progress: 0,
      },
      {
        id: "m4",
        name: "Installation Phase 1",
        date: "2026-02-28",
        completed: false,
        progress: 0,
      },
      {
        id: "m5",
        name: "Testing & Optimization",
        date: "2026-04-30",
        completed: false,
        progress: 0,
      },
    ],
    sCurveData: [
      {
        week: 1,
        planned: 1,
        actual: 1,
        cumulativePlanned: 1,
        cumulativeActual: 1,
      },
      {
        week: 2,
        planned: 2,
        actual: 2,
        cumulativePlanned: 3,
        cumulativeActual: 3,
      },
      {
        week: 3,
        planned: 3,
        actual: 3,
        cumulativePlanned: 6,
        cumulativeActual: 6,
      },
      {
        week: 4,
        planned: 4,
        actual: 4,
        cumulativePlanned: 10,
        cumulativeActual: 10,
      },
      {
        week: 5,
        planned: 5,
        actual: 5,
        cumulativePlanned: 15,
        cumulativeActual: 15,
      },
      {
        week: 6,
        planned: 6,
        actual: 6,
        cumulativePlanned: 21,
        cumulativeActual: 21,
      },
      {
        week: 7,
        planned: 7,
        actual: 7,
        cumulativePlanned: 28,
        cumulativeActual: 28,
      },
      {
        week: 8,
        planned: 8,
        actual: 8,
        cumulativePlanned: 36,
        cumulativeActual: 36,
      },
      {
        week: 9,
        planned: 9,
        actual: 9,
        cumulativePlanned: 45,
        cumulativeActual: 45,
      },
      {
        week: 10,
        planned: 10,
        actual: 10,
        cumulativePlanned: 55,
        cumulativeActual: 55,
      },
    ],
    risks: [
      {
        id: "r1",
        description: "Regulatory approval delays",
        severity: "High",
        status: "Open",
      },
      {
        id: "r2",
        description: "High initial investment",
        severity: "Medium",
        status: "Open",
      },
      {
        id: "r3",
        description: "Technology obsolescence",
        severity: "Low",
        status: "Mitigated",
      },
    ],
    kpis: [
      { name: "CO2 Reduction", target: 30, actual: 0, unit: "%" },
      { name: "Energy Cost Savings", target: 25, actual: 0, unit: "%" },
      { name: "ROI", target: 8, actual: 0, unit: "years" },
    ],
  },
];

// Helper functions
export const getProjectById = (id: string): ProjectData | undefined => {
  return projectsDummyData.find((project) => project.id === id);
};

export const getProjectsByStatus = (
  status: ProjectData["status"]
): ProjectData[] => {
  return projectsDummyData.filter((project) => project.status === status);
};

export const getTotalBudget = (): number => {
  return projectsDummyData.reduce(
    (total, project) => total + project.budget,
    0
  );
};

export const getActiveProjects = (): ProjectData[] => {
  return projectsDummyData.filter(
    (project) =>
      project.status === "In Progress" || project.status === "Planning"
  );
};
