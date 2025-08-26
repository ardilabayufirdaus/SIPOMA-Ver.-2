"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  approved: boolean;
}

export default function UserApprovalsPanel() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    setLoading(true);
    setError(null);
    // Ambil user yang belum approved dari tabel users
    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, approved")
      .or("approved.eq.false,approved.is.null");
    if (error) setError(error.message);
    setPendingUsers(data || []);
    setLoading(false);
  }

  async function approveUser(user: PendingUser) {
    setLoading(true);
    setError(null);
    // Update kolom approved di tabel users
    const { error: updateError } = await supabase
      .from("users")
      .update({ approved: true })
      .eq("id", user.id);
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    // Update user_metadata di Supabase Auth agar user bisa login penuh
    const { error: metaError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: { approved: true },
      }
    );
    if (metaError) setError(metaError.message);
    await fetchPendingUsers();
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      {loading && <div className="mb-4">Memuat data...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        {pendingUsers.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            Tidak ada data pengguna yang perlu disetujui.
          </div>
        )}
        {pendingUsers.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lengkap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-yellow-500">Pending</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="default"
                      disabled={loading}
                      onClick={() => approveUser(user)}
                    >
                      Setujui
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
