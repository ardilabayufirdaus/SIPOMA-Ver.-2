"use client";
import React from "react";
import UserManagementPanel from "@/components/admin/UserManagementPanel";

export default function UserManagementPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manajemen Pengguna</h1>
      <UserManagementPanel />
    </main>
  );
}
