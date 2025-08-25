"use client";

import {
  Plus,
  FileText,
  Settings,
  Download,
  Users,
  Calendar,
  BarChart3,
  Truck,
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      id: "new-project",
      title: "New Project",
      description: "Create new project",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/projects/new",
    },
    {
      id: "daily-report",
      title: "Daily Report",
      description: "Generate daily report",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600",
      href: "/reports/daily",
    },
    {
      id: "factory-data",
      title: "Factory Data",
      description: "Enter CCR data",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-red-500 hover:bg-red-600",
      href: "/factory-control/ccr-data",
    },
    {
      id: "delivery-plan",
      title: "Delivery Plan",
      description: "Create delivery plan",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/port-performance/plans",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/analytics",
    },
    {
      id: "schedule",
      title: "Schedule",
      description: "View schedule",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      href: "/schedule",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Project "Kiln Upgrade" updated',
      time: "5 minutes ago",
      user: "John Doe",
    },
    {
      id: 2,
      action: "Daily production report generated",
      time: "1 hour ago",
      user: "System",
    },
    {
      id: 3,
      action: "Mill 3 maintenance scheduled",
      time: "2 hours ago",
      user: "Jane Smith",
    },
    {
      id: 4,
      action: "New delivery plan created",
      time: "3 hours ago",
      user: "Mike Johnson",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Frequently used actions
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <button
                key={action.id}
                className="group relative flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mb-2 transition-colors`}
                >
                  {action.icon}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {action.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                  {action.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activities
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest system activities
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              View All Activities →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
