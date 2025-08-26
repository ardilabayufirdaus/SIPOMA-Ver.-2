"use client";
import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { supabase, usersTable } from "@/lib/supabase/client";

import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [userPermissions, setUserPermissions] = useState<
    Record<string, string[]> | undefined
  >(undefined);
  const pathname = usePathname();
  // Hide AppHeader and Sidebar on /login (and optionally /logout)
  const hideHeader = pathname === "/login";

  useEffect(() => {
    async function fetchUserRoleAndPermissions() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setUserRole(undefined);
        setUserPermissions(undefined);
        return;
      }
      const userId = session.user.id;
      const { data } = await usersTable.findById(userId);
      if (data && typeof data === "object") {
        setUserRole((data as any).role || undefined);
        setUserPermissions((data as any).permissions || undefined);
      } else {
        setUserRole(session.user.user_metadata?.role || undefined);
        setUserPermissions(undefined);
      }
    }
    fetchUserRoleAndPermissions();
  }, []);

  return (
    <>
      {!hideHeader && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={userRole}
          userPermissions={userPermissions}
        />
      )}
      {!hideHeader && (
        <AppHeader
          onSidebarOpen={() => setSidebarOpen(true)}
          userRole={userRole}
        />
      )}
      <div className="min-h-screen bg-background">{children}</div>
    </>
  );
}
