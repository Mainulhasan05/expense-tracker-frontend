"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/features/admin/adminAPI";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  FolderOpen,
  CheckCircle,
  XCircle,
  Send,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setError(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { overview, transactions, recentActivity, charts } = stats;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            System overview and statistics
          </p>
        </div>
        <Link
          href="/dashboard/admin/users"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Manage Users
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {overview.totalUsers}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                +{recentActivity.newUsers} this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {overview.totalTransactions}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                +{recentActivity.newTransactions} this month
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${transactions.totalIncome.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {transactions.incomeCount} transactions
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${transactions.totalExpenses.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {transactions.expenseCount} transactions
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verified Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Verification</h3>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {overview.verifiedUsers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Unverified</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {overview.unverifiedUsers}
              </span>
            </div>
          </div>
        </div>

        {/* Auth Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Authentication</h3>
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Google OAuth</span>
              <span className="text-sm font-semibold">
                {overview.googleUsers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email/Password</span>
              <span className="text-sm font-semibold">
                {overview.emailUsers}
              </span>
            </div>
          </div>
        </div>

        {/* Telegram Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Integrations</h3>
            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Telegram Connected</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {overview.telegramUsers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Not Connected</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {overview.totalUsers - overview.telegramUsers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Categories</h3>
          <FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="space-y-3">
          {charts.topCategories.slice(0, 5).map((category, index) => (
            <div key={category._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6">
                  #{index + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category._id || "Uncategorized"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {category.count} transactions
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${category.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">System Health</h3>
          <p className="text-sm opacity-90 mb-4">All systems operational</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Net Balance</h3>
          <p className="text-3xl font-bold">
            ${transactions.netBalance.toFixed(2)}
          </p>
          <p className="text-sm opacity-90 mt-2">Total across all users</p>
        </div>
      </div>
    </div>
  );
}
