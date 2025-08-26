import { createClient } from "@supabase/supabase-js";

// Hardcoded for dev: ganti ke env var di production
const supabaseUrl = "https://ectjrbguwmlkqfyeyfvo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGpyYmd1d21sa3FmeWV5ZnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzcwNDQsImV4cCI6MjA3MTYxMzA0NH0.ow7ULIZ0uBhlGhICcbQf7Ie93JjzTNXo0YJEgtv7eZU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database helper functions
export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<{ data: T[] | null; error: any }> {
  try {
    const { data, error } = await supabase.rpc("execute_sql", {
      query,
      params: params || [],
    });

    return { data, error };
  } catch (error) {
    console.error("Database query error:", error);
    return { data: null, error };
  }
}

// Real-time subscription helper
export function subscribeToTable<T>(
  tableName: string,
  callback: (payload: any) => void,
  filter?: string
) {
  const subscription = supabase
    .channel(`public:${tableName}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: tableName,
        filter: filter,
      },
      callback
    )
    .subscribe();

  return subscription;
}

// User management functions
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function signUp(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

// File storage functions
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: any
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);

  return { data, error };
}

export async function downloadFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).download(path);

  return { data, error };
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

// Generic CRUD operations
export class SupabaseTable<T> {
  constructor(private tableName: string) {}

  async findAll(options?: {
    select?: string;
    filter?: any;
    order?: { column: string; ascending: boolean };
    limit?: number;
    offset?: number;
  }): Promise<{ data: T[] | null; error: any; count?: number }> {
    let query = supabase
      .from(this.tableName)
      .select(options?.select || "*", { count: "exact" });

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options?.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;
    // Ensure data is only T[] | null, never error array
    let safeData: T[] | null = null;
    if (!error && Array.isArray(data)) {
      // Check if the first element is not a GenericStringError
      if (
        data.length === 0 ||
        !("message" in data[0] && typeof data[0].message === "string")
      ) {
        safeData = data as T[];
      }
    }
    return {
      data: safeData,
      error,
      count: count === null ? undefined : count,
    };
  }

  async findById(
    id: string,
    select?: string
  ): Promise<{ data: T | null; error: any }> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(select || "*")
      .eq("id", id)
      .single();

    // If error is present, data should be null
    // Ensure data is only T | null, never error object
    let safeData: T | null = null;
    if (!error && data) {
      const d: any = data;
      if (
        !(
          typeof d === "object" &&
          d !== null &&
          "message" in d &&
          typeof d.message === "string"
        )
      ) {
        safeData = data as T;
      }
    }
    return { data: safeData, error };
  }

  async create(item: Partial<T>): Promise<{ data: T | null; error: any }> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();

    return { data, error };
  }

  async update(
    id: string,
    updates: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }

  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);

    return { error };
  }

  async bulkInsert(
    items: Partial<T>[]
  ): Promise<{ data: T[] | null; error: any }> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(items)
      .select();

    return { data, error };
  }

  async bulkUpdate(
    updates: { id: string; data: Partial<T> }[]
  ): Promise<{ data: T[] | null; error: any }> {
    const promises = updates.map(({ id, data }) => this.update(id, data));
    const results = await Promise.all(promises);

    const errors = results
      .filter((result) => result.error)
      .map((result) => result.error);
    const data = results
      .filter((result) => result.data)
      .map((result) => result.data) as T[];

    return {
      data: data.length > 0 ? data : null,
      error: errors.length > 0 ? errors : null,
    };
  }

  subscribe(callback: (payload: any) => void, filter?: string) {
    return subscribeToTable(this.tableName, callback, filter);
  }
}

// Table instances for each entity
export const projectsTable = new SupabaseTable("projects");
export const tasksTable = new SupabaseTable("tasks");
export const factoryLogsTable = new SupabaseTable("factory_logs");
export const deliveryPlansTable = new SupabaseTable("delivery_plans");
export const packingPlantStockTable = new SupabaseTable("packing_plant_stock");
export const usersTable = new SupabaseTable("users");
export const alertsTable = new SupabaseTable("alerts");

// Custom queries for specific business logic
export async function getActiveProjects() {
  return projectsTable.findAll({
    filter: { status: "active" },
    order: { column: "created_at", ascending: false },
  });
}

export async function getFactoryMetrics(startDate: string, endDate: string) {
  const { data, error } = await executeQuery(
    `
    SELECT 
      DATE(timestamp) as date,
      AVG(production_rate) as avg_production,
      SUM(energy_consumption) as total_energy,
      COUNT(*) as total_records
    FROM finish_mill_hourly_logs 
    WHERE timestamp BETWEEN $1 AND $2
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
  `,
    [startDate, endDate]
  );

  return { data, error };
}

export async function getPortPerformanceMetrics(
  period: "day" | "week" | "month" = "day"
) {
  const periodMap = {
    day: "1 day",
    week: "7 days",
    month: "30 days",
  };

  const { data, error } = await executeQuery(`
    SELECT 
      COUNT(*) as total_deliveries,
      AVG(loading_rate) as avg_loading_rate,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_deliveries,
      AVG(EXTRACT(EPOCH FROM (loading_end - loading_start))/3600) as avg_loading_hours
    FROM delivery_plans 
    WHERE created_at >= NOW() - INTERVAL '${periodMap[period]}'
  `);

  return { data, error };
}

export async function getPackingPlantSummary() {
  const { data, error } = await executeQuery(`
    SELECT 
      p.plant_name,
      p.plant_code,
      s.current_stock,
      s.capacity,
      (s.current_stock / s.capacity * 100) as utilization_percentage,
      s.days_of_stock
    FROM packing_plant_master p
    LEFT JOIN (
      SELECT DISTINCT ON (plant_id) 
        plant_id, current_stock, capacity, days_of_stock
      FROM packing_plant_daily_stock 
      ORDER BY plant_id, date DESC
    ) s ON p.id = s.plant_id
    WHERE p.is_active = true
  `);

  return { data, error };
}

export async function getAlertsSummary() {
  const { data, error } = await executeQuery(`
    SELECT 
      severity,
      COUNT(*) as count,
      COUNT(CASE WHEN acknowledged = false THEN 1 END) as unacknowledged
    FROM alerts 
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND resolved = false
    GROUP BY severity
  `);

  return { data, error };
}

// Real-time data subscriptions
export function subscribeToFactoryData(callback: (data: any) => void) {
  return subscribeToTable("finish_mill_hourly_logs", callback);
}

export function subscribeToAlerts(callback: (data: any) => void) {
  return subscribeToTable("alerts", callback, "resolved.eq.false");
}

export function subscribeToDeliveryUpdates(callback: (data: any) => void) {
  return subscribeToTable(
    "delivery_plans",
    callback,
    "status.in.(planned,confirmed,in_progress)"
  );
}
