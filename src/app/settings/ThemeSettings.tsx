import React from "react";

export default function ThemeSettings() {
  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="light"
          className="accent-primary-600"
        />
        <span>Light</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="dark"
          className="accent-primary-600"
        />
        <span>Dark</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="system"
          className="accent-primary-600"
          defaultChecked
        />
        <span>System</span>
      </label>
    </div>
  );
}
