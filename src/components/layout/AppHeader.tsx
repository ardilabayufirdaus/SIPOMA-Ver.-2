"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { supabase, usersTable } from "@/lib/supabase/client";

interface AppHeaderProps {
  onSidebarOpen?: () => void;
  userRole?: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onSidebarOpen, userRole }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [localUserRole, setLocalUserRole] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        setLocalUserRole(undefined);
        setLoading(false);
        return;
      }
      const userId = session.user.id;
      // Ambil data user dari tabel users
      const { data, error } = await usersTable.findById(userId);
      if (data && typeof data === "object") {
        setUser({
          id: (data as any).id ?? "",
          email: (data as any).email ?? "",
          full_name: (data as any).full_name ?? "",
          avatar_url: (data as any).avatar_url || undefined,
        });
        setLocalUserRole((data as any).role || undefined);
      } else {
        // fallback ke data session jika tabel users kosong
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          full_name:
            session.user.user_metadata?.full_name || session.user.email || "",
          avatar_url: undefined,
        });
        setLocalUserRole(session.user.user_metadata?.role || undefined);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);
  // Use userRole from prop if provided, otherwise fallback to localUserRole
  const effectiveUserRole = userRole !== undefined ? userRole : localUserRole;

  const { theme, setTheme, resolvedTheme } = useTheme();

  // Notification dropdown state
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:bg-background transition-colors duration-500">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-label="Open sidebar menu"
            onClick={onSidebarOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex items-center">
            <img
              src="/sipoma-logo.png"
              alt="SIPOMA Logo"
              className="h-10 w-10 rounded-full bg-white shadow object-contain"
              style={{ background: "#fff" }}
            />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                SIPOMA
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manufacturing Control Center
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search h-5 w-5 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search projects, reports, or equipment..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-label="Toggle dark mode"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun h-5 w-5"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 16v2m11-9h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon h-5 w-5"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            )}
          </button>
          <div className="relative" ref={notifRef}>
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 relative"
              aria-label="Show notifications"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bell h-6 w-6"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 bg-primary-600 rounded-full"></span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Notifikasi
                  </span>
                </div>
                <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                  {/* Dummy notifications, replace with real data */}
                  <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary-600"></span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        Sistem berhasil melakukan sinkronisasi data produksi.
                      </span>
                    </div>
                    <span className="block text-xs text-gray-400 mt-1">
                      Baru saja
                    </span>
                  </li>
                  <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary-600"></span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        Ada 2 laporan downtime baru di Packing Plant.
                      </span>
                    </div>
                    <span className="block text-xs text-gray-400 mt-1">
                      5 menit lalu
                    </span>
                  </li>
                  <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary-600"></span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        Port performance update: Vessel baru tiba di pelabuhan.
                      </span>
                    </div>
                    <span className="block text-xs text-gray-400 mt-1">
                      10 menit lalu
                    </span>
                  </li>
                </ul>
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-primary-600 hover:underline text-sm font-medium">
                    Lihat semua notifikasi
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              {user && user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user h-5 w-5 text-gray-600 dark:text-gray-300"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
              <div className="hidden md:block text-left">
                {loading ? (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Loading...
                  </p>
                ) : user ? (
                  <>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Guest
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      -
                    </p>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
