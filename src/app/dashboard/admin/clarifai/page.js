"use client";

import { useState, useEffect } from "react";
import {
  getAllAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  testAccount,
  testParsing,
} from "@/features/admin/clarifaiAPI";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Brain,
  Zap,
  MessageSquare,
  RefreshCw,
  TestTube,
} from "lucide-react";

export default function ClarifaiManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [testMessage, setTestMessage] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // Add account form
  const [addForm, setAddForm] = useState({
    name: "",
    pat: "",
    userId: "openai",
    appId: "chat-completion",
    modelId: "gpt-oss-120b",
    modelVersionId: "b3c129d719144dd49f4cb8cb96585223",
    monthlyLimit: 1000,
    dailyLimit: 50,
    notes: "",
  });

  // Edit account form
  const [editForm, setEditForm] = useState({
    name: "",
    isActive: true,
    monthlyLimit: 1000,
    notes: "",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAccounts();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to load accounts"
      );
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();

    if (!addForm.pat.trim()) {
      alert("PAT is required");
      return;
    }

    try {
      await addAccount(addForm);
      setShowAddModal(false);
      setAddForm({
        name: "",
        pat: "",
        userId: "openai",
        appId: "chat-completion",
        modelId: "gpt-oss-120b",
        modelVersionId: "b3c129d719144dd49f4cb8cb96585223",
        monthlyLimit: 1000,
        dailyLimit: 50,
        notes: "",
      });
      loadAccounts();
      alert("Account added successfully!");
    } catch (error) {
      console.error("Error adding account:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add account. Please check the PAT."
      );
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setEditForm({
      name: account.name,
      isActive: account.isActive,
      monthlyLimit: account.limits?.monthlyLimit || 1000,
      notes: account.notes || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    try {
      await updateAccount(selectedAccount._id, editForm);
      setShowEditModal(false);
      setSelectedAccount(null);
      loadAccounts();
      alert("Account updated successfully!");
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Failed to update account");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteAccount(id);
      loadAccounts();
      alert("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  const handleTestAccount = async (account) => {
    try {
      const result = await testAccount(account._id);
      alert(`✅ Test successful!\n\nResponse: ${result.response.substring(0, 200)}...`);
    } catch (error) {
      alert(`❌ Test failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleTestParsing = async (e) => {
    e.preventDefault();

    if (!testMessage.trim()) {
      alert("Please enter a test message");
      return;
    }

    try {
      setTestLoading(true);
      setTestResult(null);
      const result = await testParsing(testMessage);
      setTestResult(result);
    } catch (error) {
      console.error("Error testing parsing:", error);
      setTestResult({
        success: false,
        error: error.response?.data?.message || "Parsing failed",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const getTotalStats = () => {
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.isActive).length,
      totalRequests: accounts.reduce((sum, a) => sum + a.usage.totalRequests, 0),
      monthlyRequests: accounts.reduce((sum, a) => sum + a.usage.monthlyRequests, 0),
      successRate:
        accounts.reduce((sum, a) => sum + a.usage.totalRequests, 0) > 0
          ? (
              (accounts.reduce((sum, a) => sum + a.usage.successfulRequests, 0) /
                accounts.reduce((sum, a) => sum + a.usage.totalRequests, 0)) *
              100
            ).toFixed(1)
          : 0,
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800">
              Error Loading Accounts
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              loadAccounts();
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-white">
            🤖 Clarifai AI Management
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Manage AI accounts for transaction parsing
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Accounts
              </p>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-green-600">{stats.active} active</p>
            </div>
            <Brain className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Requests
              </p>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
              <p className="text-sm text-gray-600">
                {stats.monthlyRequests} this month
              </p>
            </div>
            <Zap className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-3xl font-bold">{stats.successRate}%</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <button
            onClick={() => setShowTestModal(true)}
            className="w-full h-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <TestTube className="w-10 h-10 text-purple-600" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Test Parsing
            </p>
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usage (Monthly)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {accounts.map((account) => {
                const successRate =
                  account.usage.totalRequests > 0
                    ? (
                        (account.usage.successfulRequests /
                          account.usage.totalRequests) *
                        100
                      ).toFixed(1)
                    : 0;
                const usagePercent = (
                  (account.usage.monthlyRequests / account.limits.monthlyLimit) *
                  100
                ).toFixed(1);

                return (
                  <tr key={account._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(account.isActive)}
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-xs text-gray-500">
                            PAT: {account.pat}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(account.isActive)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {account.usage.monthlyRequests} /{" "}
                          {account.limits.monthlyLimit}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                usagePercent > 80
                                  ? "bg-red-600"
                                  : usagePercent > 50
                                    ? "bg-yellow-600"
                                    : "bg-green-600"
                              }`}
                              style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">
                            {usagePercent}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{successRate}%</p>
                        <p className="text-xs text-gray-600">
                          {account.usage.successfulRequests} /{" "}
                          {account.usage.totalRequests}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">
                        {account.usage.lastUsed
                          ? new Date(account.usage.lastUsed).toLocaleString()
                          : "Never"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTestAccount(account)}
                          className="text-green-600 hover:text-green-800"
                          title="Test Account"
                        >
                          <TestTube className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(account)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(account._id, account.name)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {accounts.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No Clarifai accounts configured. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Clarifai Account</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="e.g., Clarifai Account 1"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Personal Access Token (PAT) *
                  </label>
                  <input
                    type="text"
                    value={addForm.pat}
                    onChange={(e) =>
                      setAddForm({ ...addForm, pat: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                    placeholder="Get from clarifai.com/settings/security"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your PAT from{" "}
                    <a
                      href="https://clarifai.com/settings/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Clarifai Settings
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={addForm.userId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, userId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={addForm.appId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, appId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Model ID
                  </label>
                  <input
                    type="text"
                    value={addForm.modelId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, modelId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="gpt-oss-120b"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Model Version ID
                  </label>
                  <input
                    type="text"
                    value={addForm.modelVersionId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, modelVersionId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                    placeholder="b3c129d719144dd49f4cb8cb96585223"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    value={addForm.monthlyLimit}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        monthlyLimit: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Daily Limit
                  </label>
                  <input
                    type="number"
                    value={addForm.dailyLimit}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        dailyLimit: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={addForm.notes}
                    onChange={(e) =>
                      setAddForm({ ...addForm, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows="2"
                    placeholder="Optional notes about this account"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({
                      name: "",
                      pat: "",
                      userId: "openai",
                      appId: "chat-completion",
                      modelId: "gpt-oss-120b",
                      modelVersionId: "b3c129d719144dd49f4cb8cb96585223",
                      monthlyLimit: 1000,
                      dailyLimit: 50,
                      notes: "",
                    });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Account</h2>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Limit
                </label>
                <input
                  type="number"
                  value={editForm.monthlyLimit}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      monthlyLimit: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows="2"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAccount(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Parsing Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">🧪 Test AI Parsing</h2>
            <form onSubmit={handleTestParsing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Test Message
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows="3"
                  placeholder='Try: "lunch 250tk and ricksha vara 20tk" or "আজকে ৫০০ টাকা বাজার করেছি"'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports English, Bengali (বাংলা), and mixed languages
                </p>
              </div>

              <button
                type="submit"
                disabled={testLoading || !testMessage.trim()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testLoading ? "Parsing..." : "Test Parsing"}
              </button>

              {testResult && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    testResult.success && testResult.data?.valid
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {testResult.success && testResult.data?.valid ? (
                    <>
                      <h3 className="font-bold text-green-800 mb-2">
                        ✅ Parsing Successful!
                      </h3>
                      <div className="space-y-2">
                        {testResult.data.transactions.map((t, i) => (
                          <div
                            key={i}
                            className="bg-white p-3 rounded border border-green-200"
                          >
                            <p className="text-sm">
                              <strong>Type:</strong> {t.type === "expense" ? "💸 Expense" : "💰 Income"}
                            </p>
                            <p className="text-sm">
                              <strong>Amount:</strong> {t.currency}{" "}
                              {Math.abs(t.amount)}
                            </p>
                            <p className="text-sm">
                              <strong>Description:</strong> {t.description}
                            </p>
                            <p className="text-sm">
                              <strong>Category:</strong> {t.category}
                            </p>
                            <p className="text-sm">
                              <strong>Date:</strong> {t.date}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Account: {testResult.accountUsed} | Duration:{" "}
                        {testResult.duration}ms
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-red-800 mb-2">
                        {testResult.success && !testResult.data?.valid
                          ? "⚠️ Not a Transaction"
                          : "❌ Parsing Failed"}
                      </h3>
                      <p className="text-sm text-red-700">
                        {testResult.data?.reason || testResult.error || "Unknown error"}
                      </p>
                    </>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setTestMessage("");
                  setTestResult(null);
                }}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
