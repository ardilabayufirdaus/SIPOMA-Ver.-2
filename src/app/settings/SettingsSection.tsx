import React from "react";

export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
        {children}
      </div>
    </section>
  );
}
