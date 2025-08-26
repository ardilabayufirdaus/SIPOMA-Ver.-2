import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => req.cookies.get(name)?.value } }
    );
    const { email, password, full_name } = await req.json();
    // Register user with status 'pending' in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, status: "pending" },
        emailRedirectTo: undefined,
      },
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    // Optionally: Insert a notification row for admin approval
    // await supabase.from('notifications').insert({ type: 'register', email, full_name });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
