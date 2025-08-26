import React from "react";

export default function AppInfo() {
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      <div className="mb-2">SIPOMA v2.0.0</div>
      <div>© 2025 SIPOMA Team</div>
      <div>
        Support:{" "}
        <a
          href="mailto:support@sipoma.com"
          className="text-primary-600 underline"
        >
          ardila.firdaus@sig.id
        </a>
      </div>
    </div>
  );
}
