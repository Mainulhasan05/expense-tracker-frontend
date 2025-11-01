"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAllTelegramLogs,
  getTelegramActivityStats,
  deleteTelegramLog,
  deleteUserTelegramLogs,
  restrictTelegramAccess,
  unrestrictTelegramAccess
} from "@/features/admin/adminAPI";
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Ban,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  BarChart3
} from "lucide-react";
import Link from "next/link";

function TelegramLogsContent() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    userId: searchParams.get("userId") || "",
    intent: "",
    messageType: "",
    success: "",
    startDate: "",
    endDate: ""
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filters.page, filters.intent, filters.messageType, filters.success]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllTelegramLogs(filters);
      setLogs(data?.logs || []);
      setPagination(data?.pagination || {});
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setLogs([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const data = await getTelegramActivityStats();
      setStats(data || {});
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({});
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchLogs();
  };

  const handleDeleteLog = async (logId) => {
    if (!logId) {
      alert("Invalid log ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this log entry?")) {
      return;
    }

    try {
      await deleteTelegramLog(logId);
      await fetchLogs();
      await fetchStats();
    } catch (error) {
      console.error("Delete log error:", error);
      alert(error?.response?.data?.message || "Failed to delete log");
    }
  };

  const handleDeleteUserLogs = async (userId, userName) => {
    if (!userId) {
      alert("Invalid user ID");
      return;
    }

    if (!confirm(`Delete all Telegram logs for ${userName || "this user"}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUserTelegramLogs(userId);
      await fetchLogs();
      await fetchStats();
    } catch (error) {
      console.error("Delete user logs error:", error);
      alert(error?.response?.data?.message || "Failed to delete user logs");
    }
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getIntentBadgeColor = (intent) => {
    const colors = {
      ADD_TRANSACTION: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      VIEW_TRANSACTIONS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      GET_SUMMARY: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      LINK_ACCOUNT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      HELP: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      UNKNOWN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    return colors[intent] || colors.UNKNOWN;
  };

  const getSuccessIcon = (success) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
            Telegram Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor all Telegram bot interactions and user activity
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => { fetchLogs(); fetchStats(); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <Link
            href="/dashboard/admin"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(stats?.totalMessages || 0).toLocaleString()}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(stats?.totalUsers || 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {(stats?.activeUsersToday || 0)} active today
                </p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(stats?.successRate || 0).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(stats?.last7Days || 0).toLocaleString()}
                </p>
              </div>
              <Activity className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Last Active User Card */}
      {!statsLoading && stats?.lastActiveUser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Last Active User</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.lastActiveUser.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.lastActiveUser.email}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Last activity: {new Date(stats.lastActiveUser.lastActivity).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-4">
              <Activity className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* User ID Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                placeholder="User ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Intent Filter */}
          <select
            value={filters.intent}
            onChange={(e) => setFilters({ ...filters, intent: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Intents</option>
            <option value="ADD_TRANSACTION">Add Transaction</option>
            <option value="VIEW_TRANSACTIONS">View Transactions</option>
            <option value="GET_SUMMARY">Get Summary</option>
            <option value="LINK_ACCOUNT">Link Account</option>
            <option value="HELP">Help</option>
            <option value="UNKNOWN">Unknown</option>
          </select>

          {/* Message Type Filter */}
          <select
            value={filters.messageType}
            onChange={(e) => setFilters({ ...filters, messageType: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="text">Text</option>
            <option value="voice">Voice</option>
            <option value="command">Command</option>
          </select>

          {/* Success Filter */}
          <select
            value={filters.success}
            onChange={(e) => setFilters({ ...filters, success: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading logs...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Intent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {logs && logs.length > 0 ? logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {log.user?.name || "Unknown"}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            @{log.telegramUsername || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {log?.userMessage || "No message"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getIntentBadgeColor(log?.intent || "UNKNOWN")}`}>
                          {log?.intent || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {log?.messageType || "text"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSuccessIcon(log?.success ?? false)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {log?.createdAt ? formatDate(log.createdAt) : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => log && viewLogDetails(log)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          disabled={!log}
                        >
                          View
                        </button>
                        <button
                          onClick={() => log?._id && handleDeleteLog(log._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          disabled={!log?._id}
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} logs
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else {
                      if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setFilters({ ...filters, page: pageNum })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          pagination.page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Log Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Log Details</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                  <p className="text-gray-900 dark:text-white">{selectedLog?.user?.name || "Unknown"} (@{selectedLog?.telegramUsername || "N/A"})</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User Message</label>
                  <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded">
                    {selectedLog?.userMessage || "No message"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bot Response</label>
                  <p className="text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    {selectedLog?.botResponse || "No response"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Intent</label>
                    <p className="text-gray-900 dark:text-white">{selectedLog?.intent || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message Type</label>
                    <p className="text-gray-900 dark:text-white capitalize">{selectedLog?.messageType || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLog?.success ? "Success" : "Failed"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</label>
                    <p className="text-gray-900 dark:text-white">{selectedLog?.createdAt ? formatDate(selectedLog.createdAt) : "N/A"}</p>
                  </div>
                </div>

                {selectedLog?.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Metadata</label>
                    <pre className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (selectedLog?._id) {
                      handleDeleteLog(selectedLog._id);
                      setShowDetailsModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TelegramLogsPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <TelegramLogsContent />
    </Suspense>
  );
}
