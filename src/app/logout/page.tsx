"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      router.replace("/login");
    }
    doLogout();
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg font-semibold">Logging out...</div>
    </div>
  );
}
