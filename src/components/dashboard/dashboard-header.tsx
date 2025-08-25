"use client";

import { useState, useRef, useEffect } from "react";
// Dummy notifications
const notifications = [
  {
    id: 1,
    title: "Downtime Alert",
    desc: "Packer 2 mengalami downtime 5 menit.",
    time: "Baru saja",
  },
  {
    id: 2,
    title: "Quality Update",
    desc: "Kadar air klinker batch 1234 di atas ambang.",
    time: "5 menit lalu",
  },
  {
    id: 3,
    title: "Port Berth Free",
    desc: "Berth 1 di pelabuhan siap digunakan.",
    time: "10 menit lalu",
  },
];
// Sidebar menu items
const sidebarMenu = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Factory Control", href: "/factory-control", icon: "🏭" },
  { name: "Port Performance", href: "/port-performance", icon: "⚓" },
  { name: "Packing Plant", href: "/packing-plant", icon: "📦" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
  { name: "Logout", href: "/logout", icon: "🚪" },
];
import { Search, Bell, User, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function DashboardHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  // Close notif panel on click outside
  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        notifPanelRef.current &&
        !notifPanelRef.current.contains(e.target as Node) &&
        notifBtnRef.current &&
        !notifBtnRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  return (
    <>
      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!sidebarOpen}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              SIPOMA
            </span>
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {sidebarMenu.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
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

          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search projects, reports, or equipment..."
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                ref={notifBtnRef}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 relative"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Show notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-primary-600 rounded-full"></span>
              </button>
              {/* Notif Panel */}
              {notifOpen && (
                <div
                  ref={notifPanelRef}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 animate-fade-in"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                    Notifikasi
                    <button
                      className="text-xs text-gray-400 hover:text-primary-600"
                      onClick={() => setNotifOpen(false)}
                      aria-label="Tutup notifikasi"
                    >
                      Tutup
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto">
                    {notifications.length === 0 && (
                      <li className="px-4 py-6 text-center text-gray-400">
                        Tidak ada notifikasi
                      </li>
                    )}
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {notif.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {notif.desc}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {notif.time}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Administrator
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@sipoma.com
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
