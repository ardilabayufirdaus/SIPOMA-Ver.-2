"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Register state
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setSuccess("Login berhasil! Mengalihkan ke dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 flex flex-col items-center z-10"
        style={{ animation: "fadeInUp 0.8s cubic-bezier(.4,2,.3,1)" }}
      >
        <div className="relative h-20 w-20 mb-4">
          <Image
            src="/sipoma-logo.png"
            alt="SIPOMA Logo"
            fill
            sizes="80px"
            className="rounded-full shadow-lg border-2 border-primary-600 bg-white object-contain"
            style={{
              objectFit: "contain",
              animation: "logoPop 1s cubic-bezier(.4,2,.3,1)",
            }}
          />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
          SIPOMA
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
          Sistem Informasi Produksi Management
          <br />
          Manufacturing Control Center
        </p>

        {/* Toggle between Login and Register */}
        <div className="w-full mb-4 flex justify-center gap-2">
          <button
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-all ${
              !showRegister
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setShowRegister(false)}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-all ${
              showRegister
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setShowRegister(true)}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {!showRegister && (
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center animate-pulse">
                {success}
              </div>
            )}
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-300 w-full shadow"
              disabled={loading}
              style={{
                transition: "transform .2s",
                transform: loading ? "scale(0.98)" : undefined,
              }}
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {showRegister && (
          <form
            className="w-full space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setRegLoading(true);
              setRegError("");
              setRegSuccess("");
              try {
                const res = await fetch("/api/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: regEmail,
                    password: regPassword,
                    full_name: regName,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Gagal register");
                setRegSuccess(
                  "Registrasi berhasil! Menunggu persetujuan admin."
                );
                setRegName("");
                setRegEmail("");
                setRegPassword("");
              } catch (err: unknown) {
                // Narrow unknown to Error-like
                const message =
                  err && typeof err === "object" && "message" in err
                    ? String((err as { message?: unknown }).message)
                    : String(err);
                setRegError(message);
              } finally {
                setRegLoading(false);
              }
            }}
          >
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="regName"
              >
                Nama Lengkap
              </label>
              <input
                id="regName"
                name="regName"
                type="text"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Nama Lengkap"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="regEmail"
              >
                Email
              </label>
              <input
                id="regEmail"
                name="regEmail"
                type="email"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="regPassword"
              >
                Password
              </label>
              <input
                id="regPassword"
                name="regPassword"
                type="password"
                className="w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            {regError && (
              <div className="text-red-600 text-sm text-center animate-pulse">
                {regError}
              </div>
            )}
            {regSuccess && (
              <div className="text-green-600 text-sm text-center animate-pulse">
                {regSuccess}
              </div>
            )}
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-300 w-full shadow"
              disabled={regLoading}
              style={{
                transition: "transform .2s",
                transform: regLoading ? "scale(0.98)" : undefined,
              }}
            >
              {regLoading ? "Memproses..." : "Register"}
            </button>
            <div className="text-xs text-gray-400 text-center mt-2">
              Setelah register, admin akan menerima notifikasi untuk menyetujui
              akun Anda.
            </div>
          </form>
        )}

        <div className="mt-6 text-xs text-gray-400 text-center w-full">
          &copy; {new Date().getFullYear()} SIPOMA. All rights reserved.
        </div>
      </div>
    </div>
  );
}
