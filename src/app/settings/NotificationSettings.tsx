import React from "react";

export default function NotificationSettings() {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-primary-600" defaultChecked />
        Email Notifikasi
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-primary-600" />
        Push Notifikasi
      </label>
    </div>
  );
}
