"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setName(user.user_metadata?.name || "");
      }
    }
    fetchUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Update email
    let updateError = null;
    if (email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) updateError = error.message;
    }
    // Update password
    if (password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) updateError = error.message;
    }
    // Update name (user_metadata)
    if (name) {
      const { error } = await supabase.auth.updateUser({ data: { name } });
      if (error) updateError = error.message;
    }
    setLoading(false);
    if (updateError) setError(updateError);
    else setSuccess("Profil berhasil diperbarui.");
    setPassword("");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password Baru
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        className="mt-2 px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
