import React from "react";

export default function SecuritySettings() {
  return (
    <div className="space-y-4">
      <button className="px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition w-full">
        Logout dari semua perangkat
      </button>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-primary-600" />
          Aktifkan Two-Factor Authentication (2FA)
        </label>
      </div>
    </div>
  );
}
