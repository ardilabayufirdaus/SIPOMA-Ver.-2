"use client";
import React from "react";
import UserApprovalsPanel from "@/components/admin/UserApprovalsPanel";

export default function UserApprovalsPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Persetujuan Pengguna Baru</h1>
      <UserApprovalsPanel />
    </main>
  );
}
