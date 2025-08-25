// SIPOMA Application Constants

// Navigation menu configuration
export const NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    permissions: ["read"],
    description: "Real-time operations center",
  },
  {
    id: "projects",
    label: "Project Management",
    href: "/projects",
    icon: "FolderKanban",
    permissions: ["read"],
    description: "Comprehensive project management with AI integration",
    children: [
      { id: "projects-list", label: "All Projects", href: "/projects" },
      { id: "projects-gantt", label: "Gantt Chart", href: "/projects/gantt" },
      { id: "projects-reports", label: "Reports", href: "/projects/reports" },
    ],
  },
  {
    id: "factory-control",
    label: "Factory Control",
    href: "/factory-control",
    icon: "Factory",
    permissions: ["read"],
    description: "Digital factory management system",
    children: [
      {
        id: "overview",
        label: "Factory Overview",
        href: "/factory-control/overview",
      },
      {
        id: "ccr-data-entry",
        label: "CCR Data Entry",
        href: "/factory-control/ccr-data-entry",
      },
      {
        id: "autonomous-monitoring",
        label: "Autonomous Monitoring",
        href: "/factory-control/autonomous-monitoring",
      },
      {
        id: "mill-management",
        label: "Mill Management",
        href: "/factory-control/mill-management",
      },
      {
        id: "parameter-tracking",
        label: "Parameter Tracking",
        href: "/factory-control/parameter-tracking",
      },
      {
        id: "downtime-logger",
        label: "Downtime Logger",
        href: "/factory-control/downtime-logger",
      },
      {
        id: "quality-control",
        label: "Quality Control",
        href: "/factory-control/quality-control",
      },
      {
        id: "energy-monitoring",
        label: "Energy Monitoring",
        href: "/factory-control/energy-monitoring",
      },
    ],
  },
  {
    id: "port-performance",
    label: "Port Performance",
    href: "/port-performance",
    icon: "Ship",
    permissions: ["read"],
    description: "Maritime operations optimization",
    children: [
      {
        id: "analytics",
        label: "Performance Analytics",
        href: "/port-performance/analytics",
      },
      {
        id: "plans",
        label: "Delivery Planning",
        href: "/port-performance/plans",
      },
      {
        id: "vessels",
        label: "Vessel Management",
        href: "/port-performance/vessels",
      },
      {
        id: "database",
        label: "BUP/BOR/SIRANI",
        href: "/port-performance/database",
      },
    ],
  },
  {
    id: "packing-plant",
    label: "Packing Plant",
    href: "/packing-plant",
    icon: "Package",
    permissions: ["read"],
    description: "Smart packaging operations center",
    children: [
      {
        id: "prognosa",
        label: "Stock Forecasting",
        href: "/packing-plant/prognosa",
      },
      {
        id: "logistics",
        label: "Distribution Logistics",
        href: "/packing-plant/logistics",
      },
      {
        id: "performance",
        label: "Packer Performance",
        href: "/packing-plant/packer-performance",
      },
      {
        id: "warehouse",
        label: "Warehouse Management",
        href: "/packing-plant/warehouse",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
    permissions: ["read"],
    description: "Business intelligence dashboard",
  },
  {
    id: "admin",
    label: "Administration",
    href: "/admin",
    icon: "Settings",
    permissions: ["admin"],
    description: "System administration center",
    children: [
      { id: "users", label: "User Management", href: "/admin/users" },
      { id: "permissions", label: "Permissions", href: "/admin/permissions" },
      { id: "settings", label: "System Settings", href: "/admin/settings" },
    ],
  },
];

// Theme configuration
export const THEME_CONFIG = {
  name: "SIPOMA Red Theme",
  colors: {
    primary: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626", // Main brand color
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    secondary: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#b91c1c",
    info: "#3b82f6",
  },
  fonts: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"],
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
};

// Factory configuration
export const FACTORY_CONFIG = {
  mills: [
    {
      id: "mill-1",
      name: "Finish Mill 1",
      capacity: 120,
      status: "operational",
    },
    {
      id: "mill-2",
      name: "Finish Mill 2",
      capacity: 120,
      status: "operational",
    },
    {
      id: "mill-3",
      name: "Finish Mill 3",
      capacity: 100,
      status: "maintenance",
    },
    {
      id: "mill-4",
      name: "Finish Mill 4",
      capacity: 100,
      status: "operational",
    },
  ],
  shifts: [
    { id: "pagi", name: "Pagi", start: "07:00", end: "15:00" },
    { id: "sore", name: "Sore", start: "15:00", end: "23:00" },
    { id: "malam", name: "Malam", start: "23:00", end: "07:00" },
  ],
  parameters: [
    { name: "Production Rate", unit: "TPH", category: "production", order: 1 },
    { name: "Energy Consumption", unit: "kWh", category: "energy", order: 2 },
    { name: "Fineness", unit: "%", category: "quality", order: 3 },
    { name: "Strength 28d", unit: "MPa", category: "quality", order: 4 },
    { name: "Setting Time", unit: "min", category: "quality", order: 5 },
  ],
};

// Port configuration
export const PORT_CONFIG = {
  berths: [
    { id: "berth-1", name: "Berth 1", capacity: 30000, status: "available" },
    { id: "berth-2", name: "Berth 2", capacity: 50000, status: "occupied" },
    { id: "berth-3", name: "Berth 3", capacity: 40000, status: "maintenance" },
  ],
  cargo_types: [
    "Cement Bulk",
    "Cement Bags",
    "Clinker",
    "Fly Ash",
    "Limestone",
  ],
  loading_equipment: [
    { id: "shiploaders-1", name: "Ship Loader 1", capacity: 800 },
    { id: "shiploaders-2", name: "Ship Loader 2", capacity: 1000 },
    { id: "conveyor-1", name: "Conveyor Belt 1", capacity: 600 },
  ],
};

// Packing plant configuration
export const PACKING_PLANT_CONFIG = {
  plants: [
    {
      id: "plant-jakarta",
      name: "Jakarta Plant",
      code: "JKT",
      location: "Jakarta",
      capacity: 5000,
      storage: 10000,
    },
    {
      id: "plant-surabaya",
      name: "Surabaya Plant",
      code: "SBY",
      location: "Surabaya",
      capacity: 4000,
      storage: 8000,
    },
    {
      id: "plant-medan",
      name: "Medan Plant",
      code: "MDN",
      location: "Medan",
      capacity: 3000,
      storage: 6000,
    },
  ],
  bag_types: [
    { type: "40kg", description: "40 kg cement bags" },
    { type: "50kg", description: "50 kg cement bags" },
  ],
};

// KPI thresholds and targets
export const KPI_TARGETS = {
  factory: {
    production_efficiency: { target: 85, warning: 75, critical: 65 },
    energy_efficiency: { target: 90, warning: 80, critical: 70 },
    quality_score: { target: 95, warning: 90, critical: 85 },
    downtime_percentage: { target: 5, warning: 10, critical: 15 },
  },
  port: {
    berth_utilization: { target: 80, warning: 70, critical: 60 },
    loading_rate: { target: 800, warning: 600, critical: 400 },
    turnaround_time: { target: 24, warning: 36, critical: 48 },
    otif_percentage: { target: 95, warning: 90, critical: 85 },
  },
  packing: {
    stock_accuracy: { target: 98, warning: 95, critical: 90 },
    packer_efficiency: { target: 90, warning: 85, critical: 80 },
    distribution_timeliness: { target: 95, warning: 90, critical: 85 },
  },
};

// Alert configuration
export const ALERT_CONFIG = {
  types: {
    equipment: { color: "#dc2626", icon: "AlertTriangle" },
    quality: { color: "#f59e0b", icon: "Shield" },
    safety: { color: "#b91c1c", icon: "AlertOctagon" },
    production: { color: "#3b82f6", icon: "Factory" },
    maintenance: { color: "#8b5cf6", icon: "Wrench" },
    weather: { color: "#06b6d4", icon: "Cloud" },
  },
  severities: {
    low: { color: "#22c55e", priority: 1 },
    medium: { color: "#f59e0b", priority: 2 },
    high: { color: "#dc2626", priority: 3 },
    critical: { color: "#b91c1c", priority: 4 },
  },
};

// Chart configurations
export const CHART_CONFIG = {
  colors: {
    primary: "#dc2626",
    secondary: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
    neutral: "#6b7280",
  },
  gradients: {
    red: ["#dc2626", "#ef4444"],
    green: ["#059669", "#22c55e"],
    blue: ["#1d4ed8", "#3b82f6"],
    yellow: ["#d97706", "#f59e0b"],
  },
};

// Data refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  real_time: 5000, // 5 seconds
  dashboard: 30000, // 30 seconds
  charts: 60000, // 1 minute
  reports: 300000, // 5 minutes
  analytics: 600000, // 10 minutes
};

// File upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
  buckets: {
    avatars: "avatars",
    documents: "documents",
    reports: "reports",
    attachments: "attachments",
  },
};

// Pagination configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 1000,
};

// Date format configuration
export const DATE_FORMATS = {
  display: "dd/MM/yyyy",
  displayWithTime: "dd/MM/yyyy HH:mm",
  api: "yyyy-MM-dd",
  apiWithTime: "yyyy-MM-dd HH:mm:ss",
};

// Language configuration
export const LANGUAGE_CONFIG = {
  default: "id",
  supported: [
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ],
};

// Notification configuration
export const NOTIFICATION_CONFIG = {
  duration: {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000,
  },
  position: "top-right" as const,
  maxNotifications: 5,
};

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: 3000, // 3 seconds
  apiResponseTime: 1000, // 1 second
  renderTime: 16, // 16ms (60 FPS)
  memoryUsage: 100, // 100MB
  bundleSize: 2048, // 2MB
};

// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
};

// PWA configuration
export const PWA_CONFIG = {
  name: "SIPOMA",
  short_name: "SIPOMA",
  description:
    "Sistem Informasi Produksi Management - Aplikasi manufaktur semen ultra-modern",
  theme_color: "#dc2626",
  background_color: "#ffffff",
  display: "standalone" as const,
  orientation: "portrait" as const,
  scope: "/",
  start_url: "/",
};

// Feature flags
export const FEATURE_FLAGS = {
  ai_suggestions: true,
  real_time_notifications: true,
  dark_mode: true,
  offline_mode: true,
  voice_commands: false,
  biometric_auth: false,
  advanced_analytics: true,
  predictive_maintenance: true,
};

// Environment-specific configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  enableDebug: process.env.NEXT_PUBLIC_DEBUG === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
};
