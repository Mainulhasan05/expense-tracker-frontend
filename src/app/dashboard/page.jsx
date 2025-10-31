"use client";

import { useEffect, useState } from "react";
import DashboardWidgets from "@/components/dashboard/widgets";
import FinancialCharts from "@/components/dashboard/financial-charts";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import CategoryWiseCharts from "@/components/dashboard/category-wise-charts";
import AddTransactionButton from "@/components/transactions/add-transaction-button";
import { XCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    // Check if user was redirected due to admin access denial
    const cookies = document.cookie.split(";");
    const accessDeniedCookie = cookies.find(c => c.trim().startsWith("admin-access-denied="));

    if (accessDeniedCookie) {
      setShowAccessDenied(true);
      // Clear the cookie
      document.cookie = "admin-access-denied=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowAccessDenied(false);
      }, 5000);
    }
  }, []);

  return (
    <div className="space-y-6 pt-16">
      {showAccessDenied && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800">Access Denied</h3>
            <p className="text-sm text-red-700 mt-1">
              You don't have permission to access the admin area. Admin privileges are required.
            </p>
          </div>
          <button
            onClick={() => setShowAccessDenied(false)}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your financial health</p>
        </div>
        <AddTransactionButton />
      </div>

      <DashboardWidgets />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialCharts />
        <RecentTransactions />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CategoryWiseCharts />
      </div>
    </div>
  );
}
