// Core Types untuk SIPOMA Application
export interface DateTime {
  toISOString(): string;
  getTime(): number;
}

// User Management & Security
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: Department;
  permissions: PermissionMatrix;
  preferences: UserPreferences;
  last_active: DateTime;
  avatar_url?: string;
  two_factor_enabled: boolean;
  phone?: string;
  employee_id?: string;
  hire_date?: DateTime;
  is_active: boolean;
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  SUPERVISOR = "supervisor",
  OPERATOR = "operator",
  GUEST = "guest",
}

export enum PermissionLevel {
  NONE = "none",
  READ = "read",
  WRITE = "write",
  ADMIN = "admin",
}

export interface PermissionMatrix {
  dashboard: PermissionLevel;
  projects: PermissionLevel;
  factory_control: PermissionLevel;
  port_performance: PermissionLevel;
  packing_plant: PermissionLevel;
  admin: PermissionLevel;
  reports: PermissionLevel;
  master_data: PermissionLevel;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "id" | "en";
  timezone: string;
  dashboard_layout: string[];
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  real_time: boolean;
}

export enum Department {
  PRODUCTION = "production",
  QUALITY = "quality",
  MAINTENANCE = "maintenance",
  LOGISTICS = "logistics",
  ADMIN = "admin",
  IT = "it",
}

// Project Management
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  start_date: DateTime;
  end_date: DateTime;
  progress: number;
  health_score: number;
  owner_id: string;
  team_members: string[];
  budget: number;
  actual_cost: number;
  tags: string[];
  created_at: DateTime;
  updated_at: DateTime;
}

export enum ProjectStatus {
  PLANNING = "planning",
  ACTIVE = "active",
  COMPLETED = "completed",
  ON_HOLD = "on-hold",
  CANCELLED = "cancelled",
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee_id?: string;
  start_date: DateTime;
  due_date: DateTime;
  progress: number;
  dependencies: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  created_at: DateTime;
  updated_at: DateTime;
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  REVIEW = "review",
  COMPLETED = "completed",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  created_at: DateTime;
}

export interface Attachment {
  id: string;
  filename: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: DateTime;
}

// Factory Operations
export interface FinishMillHourlyLog {
  id: string;
  mill_id: string;
  timestamp: DateTime;
  parameters: Record<string, number>;
  operator_id: string;
  shift: Shift;
  quality_parameters: QualityParams;
  production_rate: number;
  energy_consumption: number;
  raw_materials: RawMaterialConsumption[];
  created_at: DateTime;
  updated_at: DateTime;
}

export enum Shift {
  PAGI = "pagi",
  SORE = "sore",
  MALAM = "malam",
}

export interface QualityParams {
  fineness: number;
  strength_28d: number;
  setting_time: number;
  soundness: number;
  so3_content: number;
  chloride_content: number;
}

export interface RawMaterialConsumption {
  material_id: string;
  material_name: string;
  consumption_rate: number;
  unit: string;
}

export interface ParameterSetting {
  id: string;
  category: string;
  parameter_name: string;
  unit: string;
  target_value?: number;
  min_value?: number;
  max_value?: number;
  display_order: number;
  is_active: boolean;
  created_at: DateTime;
}

export interface FactoryDowntimeLog {
  id: string;
  equipment_id: string;
  start_time: DateTime;
  end_time?: DateTime;
  duration_minutes?: number;
  reason: string;
  category: DowntimeCategory;
  severity: Severity;
  operator_id: string;
  resolution: string;
  created_at: DateTime;
}

export enum DowntimeCategory {
  MECHANICAL = "mechanical",
  ELECTRICAL = "electrical",
  MAINTENANCE = "maintenance",
  OTHER = "other",
}

export enum Severity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface SiloStock {
  id: string;
  silo_id: string;
  material_type: string;
  current_stock: number;
  capacity: number;
  last_updated: DateTime;
  temperature?: number;
  humidity?: number;
  quality_grade: string;
}

// Port Performance
export interface DeliveryPlan {
  id: string;
  vessel_name: string;
  cargo_type: string;
  planned_quantity: number;
  actual_quantity?: number;
  loading_rate: number;
  berth_allocation: string;
  weather_condition: WeatherCondition;
  priority_level: Priority;
  ai_suggestions: AISuggestion[];
  status: DeliveryStatus;
  timeline: TimelineEvent[];
  eta: DateTime;
  etd: DateTime;
  loading_start?: DateTime;
  loading_end?: DateTime;
}

export enum DeliveryStatus {
  PLANNED = "planned",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  DELAYED = "delayed",
  CANCELLED = "cancelled",
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  weather_description: string;
  visibility: number;
  precipitation: number;
}

export interface AISuggestion {
  id: string;
  type: "optimization" | "warning" | "recommendation";
  title: string;
  description: string;
  confidence_score: number;
  created_at: DateTime;
}

export interface TimelineEvent {
  id: string;
  event_type: string;
  description: string;
  timestamp: DateTime;
  status: "pending" | "completed" | "delayed";
}

export interface VesselMaster {
  id: string;
  vessel_name: string;
  imo_number: string;
  dwt: number;
  loa: number;
  beam: number;
  draft: number;
  vessel_type: string;
  flag: string;
  owner: string;
  is_active: boolean;
  created_at: DateTime;
}

export interface BupRecord {
  id: string;
  date: DateTime;
  vessel_name: string;
  cargo_type: string;
  quantity: number;
  loading_rate: number;
  berth: string;
  weather: string;
  remarks?: string;
}

export interface BorRecord {
  id: string;
  date: DateTime;
  vessel_name: string;
  cargo_loaded: number;
  loading_time: number;
  demurrage_hours: number;
  weather_delay: number;
  equipment_delay: number;
  remarks?: string;
}

export interface SiraniRecord {
  id: string;
  date: DateTime;
  shift: string;
  conveyor_id: string;
  tonnage: number;
  operating_hours: number;
  downtime_minutes: number;
  efficiency_percentage: number;
  operator_id: string;
}

// Packing Plant Operations
export interface PackingPlantDailyStock {
  id: string;
  plant_id: string;
  date: DateTime;
  opening_stock: number;
  stock_received: number;
  stock_dispatched: number;
  closing_stock: number;
  consumption_rate: number;
  days_of_stock: number;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface PackingPlantMaster {
  id: string;
  plant_name: string;
  plant_code: string;
  location: string;
  capacity_per_day: number;
  storage_capacity: number;
  is_active: boolean;
  contact_person: string;
  phone: string;
  created_at: DateTime;
}

export interface Packer {
  id: string;
  packer_code: string;
  plant_id: string;
  brand: string;
  model: string;
  capacity_per_hour: number;
  installation_date: DateTime;
  last_maintenance: DateTime;
  next_maintenance: DateTime;
  status: PackerStatus;
  efficiency_rating: number;
}

export enum PackerStatus {
  OPERATIONAL = "operational",
  MAINTENANCE = "maintenance",
  BREAKDOWN = "breakdown",
  IDLE = "idle",
}

export interface PackerShiftLog {
  id: string;
  packer_id: string;
  date: DateTime;
  shift: Shift;
  operator_id: string;
  bags_packed: number;
  operating_hours: number;
  downtime_minutes: number;
  efficiency_percentage: number;
  quality_issues: number;
  remarks?: string;
}

export interface DowntimeLog {
  id: string;
  packer_id: string;
  start_time: DateTime;
  end_time?: DateTime;
  duration_minutes?: number;
  reason: string;
  category: DowntimeCategory;
  severity: Severity;
  technician_id?: string;
  resolution?: string;
  parts_replaced?: string[];
  cost: number;
}

// Dashboard & Analytics
export interface LiveMetrics {
  factory_status: FactoryStatus;
  port_performance: PortMetrics;
  packing_plant_status: PackingPlantStatus;
  alerts: Alert[];
  weather: WeatherCondition;
  energy_consumption: EnergyMetrics;
}

export interface FactoryStatus {
  total_production: number;
  efficiency: number;
  active_mills: number;
  total_mills: number;
  current_issues: number;
  quality_score: number;
}

export interface PortMetrics {
  vessels_in_port: number;
  loading_rate: number;
  berth_utilization: number;
  avg_turnaround_time: number;
  weather_delays: number;
}

export interface PackingPlantStatus {
  total_plants: number;
  active_plants: number;
  total_stock: number;
  avg_consumption_rate: number;
  low_stock_alerts: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  message: string;
  source: string;
  timestamp: DateTime;
  acknowledged: boolean;
  resolved: boolean;
}

export enum AlertType {
  EQUIPMENT = "equipment",
  QUALITY = "quality",
  SAFETY = "safety",
  PRODUCTION = "production",
  MAINTENANCE = "maintenance",
  WEATHER = "weather",
}

export interface EnergyMetrics {
  total_consumption: number;
  consumption_rate: number;
  efficiency_score: number;
  cost_per_hour: number;
  peak_demand: number;
}

// Feature Flags
export interface FeatureFlags {
  id: string;
  feature_name: string;
  is_enabled: boolean;
  description: string;
  target_roles: UserRole[];
  created_at: DateTime;
  updated_at: DateTime;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
  timestamp: DateTime;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  message: string;
  status: "success" | "error";
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesDataPoint {
  timestamp: DateTime;
  value: number;
  series?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "textarea"
    | "date"
    | "checkbox";
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  placeholder?: string;
  help_text?: string;
}

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  permissions?: PermissionLevel[];
  badge?: string | number;
}

// Theme Types
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: DateTime;
  user_id?: string;
  session_id?: string;
}

// File Upload Types
export interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_at: DateTime;
  uploaded_by: string;
}

export interface UploadProgress {
  file_id: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error_message?: string;
}
