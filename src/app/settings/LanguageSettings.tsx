import React from "react";

export default function LanguageSettings() {
  return (
    <div>
      <select className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
        <option value="id">Bahasa Indonesia</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
