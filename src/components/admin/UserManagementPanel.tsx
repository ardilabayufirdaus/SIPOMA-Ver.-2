"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  email: string;
  full_name: string;
  approved: boolean;
  role?: string;
  is_active?: boolean;
  permissions?: Record<string, string[]>;
}

const MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    features: ["view"],
  },
  {
    key: "factory-control",
    label: "Factory Control",
    features: ["view", "edit", "delete"],
  },
  {
    key: "packing-plant",
    label: "Packing Plant",
    features: ["view", "edit"],
  },
  {
    key: "port-performance",
    label: "Port Performance",
    features: ["view"],
  },
  {
    key: "user-management",
    label: "User Management",
    features: ["view", "edit", "delete", "approve"],
  },
];

export default function UserManagementPanel() {
  // Set ardila.firdaus@sig.id sebagai admin utama saat mount (idempoten)
  React.useEffect(() => {
    async function setOwnerAdmin() {
      await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("email", "ardila.firdaus@sig.id");
    }
    setOwnerAdmin();
  }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<null | User>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [editPermissions, setEditPermissions] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, approved, role, is_active, permissions");
    if (error) setError(error.message);
    setUsers(data || []);
    setLoading(false);
  }

  async function toggleActive(user: User) {
    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_active: !user.is_active })
      .eq("id", user.id);
    if (updateError) setError(updateError.message);
    await fetchUsers();
    setLoading(false);
  }

  async function deleteUser(user: User) {
    setLoading(true);
    setError(null);
    // Hapus dari tabel users
    const { error: dbError } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id);
    if (dbError) setError(dbError.message);
    // Hapus dari Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) setError(authError.message);
    await fetchUsers();
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      {loading && <div className="mb-4">Memuat data...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        {users.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            Tidak ada data pengguna.
          </div>
        )}
        {users.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {user.full_name}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{user.email}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {user.role || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {user.approved ? (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Disetujui
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                      </span>
                    )}
                    {user.is_active === false && (
                      <span className="inline-block ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      variant={user.is_active ? "destructive" : "default"}
                      size="sm"
                      disabled={
                        loading || user.email === "ardila.firdaus@sig.id"
                      }
                      onClick={() => toggleActive(user)}
                    >
                      {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        loading || user.email === "ardila.firdaus@sig.id"
                      }
                      onClick={() => deleteUser(user)}
                    >
                      Hapus
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={loading}
                      onClick={() => {
                        setEditUser(user);
                        setEditForm({
                          name: user.full_name,
                          email: user.email,
                          role: user.role || "",
                        });
                        setEditPermissions(user.permissions || {});
                      }}
                    >
                      Edit
                    </Button>
                    {user.email === "ardila.firdaus@sig.id" &&
                      user.role !== "admin" && (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={loading}
                          onClick={async () => {
                            setLoading(true);
                            setError(null);
                            const { error: updateError } = await supabase
                              .from("users")
                              .update({ role: "admin" })
                              .eq("id", user.id);
                            if (updateError) setError(updateError.message);
                            await fetchUsers();
                            setLoading(false);
                          }}
                        >
                          Jadikan Admin
                        </Button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Pengguna</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                if (editUser.email === "ardila.firdaus@sig.id") {
                  // Hanya boleh update nama
                  console.log(
                    "[UserManagementPanel] Update user (nama saja):",
                    {
                      id: editUser.id,
                      payload: { full_name: editForm.name },
                    }
                  );
                  const { error: updateError, data: updateData } =
                    await supabase
                      .from("users")
                      .update({ full_name: editForm.name })
                      .eq("id", editUser.id);
                  console.log("[UserManagementPanel] Supabase response:", {
                    updateError,
                    updateData,
                  });
                  if (updateError) setError(updateError.message);
                } else {
                  const updatePayload = {
                    full_name: editForm.name,
                    email: editForm.email,
                    role: editForm.role,
                    permissions: editPermissions,
                  };
                  console.log("[UserManagementPanel] Update user:", {
                    id: editUser.id,
                    payload: updatePayload,
                  });
                  const { error: updateError, data: updateData } =
                    await supabase
                      .from("users")
                      .update(updatePayload)
                      .eq("id", editUser.id);
                  console.log("[UserManagementPanel] Supabase response:", {
                    updateError,
                    updateData,
                  });
                  if (updateError) setError(updateError.message);
                }
                await fetchUsers();
                setEditUser(null);
                setLoading(false);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  disabled={editUser.email === "ardila.firdaus@sig.id"}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, role: e.target.value }))
                  }
                  disabled={editUser.email === "ardila.firdaus@sig.id"}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Hak Akses Modul & Fitur
                </label>
                <div className="space-y-2">
                  {MODULES.map((mod) => (
                    <div key={mod.key} className="border rounded p-2">
                      <div className="font-semibold text-sm mb-1">
                        {mod.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mod.features.map((feat) => (
                          <label
                            key={feat}
                            className="inline-flex items-center gap-1 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={
                                editPermissions[mod.key]?.includes(feat) ||
                                false
                              }
                              onChange={(e) => {
                                setEditPermissions((prev) => {
                                  const current = prev[mod.key] || [];
                                  if (e.target.checked) {
                                    return {
                                      ...prev,
                                      [mod.key]: [...current, feat],
                                    };
                                  } else {
                                    return {
                                      ...prev,
                                      [mod.key]: current.filter(
                                        (f) => f !== feat
                                      ),
                                    };
                                  }
                                });
                              }}
                            />
                            {feat}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="default" disabled={loading}>
                  Simpan
                </Button>
              </div>
              {error && <div className="mt-2 text-red-600">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
