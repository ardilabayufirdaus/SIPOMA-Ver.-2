import React from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userRole?: string;
  userPermissions?: Record<string, string[]>;
}

const menuConfig = [
  {
    key: "dashboard",
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
    feature: "view",
  },
  {
    key: "factory-control",
    name: "Factory Control",
    href: "/factory-control",
    icon: "🏭",
    feature: "view",
  },
  {
    key: "port-performance",
    name: "Port Performance",
    href: "/port-performance",
    icon: "⚓",
    feature: "view",
  },
  {
    key: "projects",
    name: "Projects",
    href: "/projects",
    icon: "📁",
    feature: "view",
  },
  {
    key: "packing-plant",
    name: "Packing Plant",
    href: "/packing-plant",
    icon: "📦",
    feature: "view",
  },
  {
    key: "user-approvals",
    name: "User Approvals",
    href: "/admin/user-approvals",
    icon: "🛡️",
    feature: "view",
  },
  {
    key: "user-management",
    name: "User Management",
    href: "/admin/user-management",
    icon: "�",
    feature: "view",
  },
  {
    key: "settings",
    name: "Settings",
    href: "/settings",
    icon: "⚙️",
    feature: "view",
  },
  {
    key: "logout",
    name: "Logout",
    href: "/logout",
    icon: "�",
    feature: "view",
  },
];

export default function Sidebar({
  open,
  onClose,
  userRole,
  userPermissions,
}: SidebarProps) {
  // Jika admin, tampilkan semua menu. Jika bukan admin, filter menu sesuai permissions.
  let sidebarMenu = menuConfig;
  if (userRole !== "admin" && userPermissions) {
    sidebarMenu = menuConfig.filter((item) => {
      // Untuk menu logout dan settings, selalu tampil
      if (item.key === "logout" || item.key === "settings") return true;
      // Cek apakah user punya izin fitur pada modul tsb
      return userPermissions[item.key]?.includes(item.feature);
    });
  }
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Close sidebar overlay"
      />
      {/* Sidebar Panel */}
      <aside
        className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="font-bold text-lg text-primary-600">SIPOMA</span>
          <button
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={onClose}
            aria-label="Close sidebar"
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
              className="lucide lucide-x h-6 w-6"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {sidebarMenu.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
