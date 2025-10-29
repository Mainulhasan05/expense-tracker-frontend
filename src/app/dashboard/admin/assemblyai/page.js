"use client";

import { useState, useEffect } from "react";
import {
  getAllAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  testTranscription,
} from "@/features/admin/assemblyAIAPI";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  DollarSign,
  Music,
  RefreshCw,
} from "lucide-react";

export default function AssemblyAIManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [testAudioFile, setTestAudioFile] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // Add account form
  const [addForm, setAddForm] = useState({
    apiKey: "",
    name: "",
  });

  // Edit account form
  const [editForm, setEditForm] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Error loading accounts:", error);
      alert("Failed to load AssemblyAI accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();

    if (!addForm.apiKey.trim()) {
      alert("API key is required");
      return;
    }

    try {
      await addAccount(addForm.apiKey, addForm.name || "AssemblyAI Account");
      setShowAddModal(false);
      setAddForm({ apiKey: "", name: "" });
      loadAccounts();
      alert("Account added successfully!");
    } catch (error) {
      console.error("Error adding account:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add account. Please check the API key."
      );
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setEditForm({
      name: account.name,
      status: account.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    try {
      await updateAccount(selectedAccount.id, editForm);
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

  const handleTestTranscription = async (e) => {
    e.preventDefault();

    if (!testAudioFile) {
      alert("Please select an audio file");
      return;
    }

    try {
      setTestLoading(true);
      setTestResult(null);
      const result = await testTranscription(testAudioFile);
      setTestResult(result);
    } catch (error) {
      console.error("Error testing transcription:", error);
      setTestResult({
        success: false,
        error: error.response?.data?.message || "Transcription failed",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "exhausted":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "expired":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      exhausted: "bg-red-100 text-red-800",
      expired: "bg-orange-100 text-orange-800",
      error: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTotalStats = () => {
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.status === "active").length,
      totalCredits: accounts.reduce((sum, a) => sum + a.totalCredits, 0),
      remainingCredits: accounts.reduce((sum, a) => sum + a.remainingCredits, 0),
      totalTranscriptions: accounts.reduce(
        (sum, a) => sum + a.totalTranscriptions,
        0
      ),
      totalHours: accounts.reduce(
        (sum, a) => sum + parseFloat(a.totalAudioHours || 0),
        0
      ),
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AssemblyAI Account Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
            <Zap className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remaining Credits
              </p>
              <p className="text-3xl font-bold">
                ${stats.remainingCredits.toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">
                of ${stats.totalCredits}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Transcriptions
              </p>
              <p className="text-3xl font-bold">{stats.totalTranscriptions}</p>
            </div>
            <Music className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Audio Processed
              </p>
              <p className="text-3xl font-bold">
                {stats.totalHours.toFixed(1)}h
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
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
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trial Ends
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(account.status)}
                      <div>
                        <p className="font-medium">{account.name}</p>
                        {account.lastError && (
                          <p className="text-xs text-red-600">
                            Error: {account.lastError.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(account.status)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        ${account.remainingCredits.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        of ${account.totalCredits}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            account.usagePercentage > 80
                              ? "bg-red-600"
                              : account.usagePercentage > 50
                                ? "bg-yellow-600"
                                : "bg-green-600"
                          }`}
                          style={{ width: `${account.usagePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {account.usagePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p>{account.totalTranscriptions} transcriptions</p>
                      <p className="text-gray-600">
                        {account.totalAudioHours}h audio
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">
                      {new Date(account.trialEndDate).toLocaleDateString()}
                    </p>
                    {account.isExpired && (
                      <p className="text-xs text-red-600">Expired</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id, account.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No AssemblyAI accounts configured. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Transcription */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Test Transcription</h2>
        <form onSubmit={handleTestTranscription} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Audio File
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setTestAudioFile(e.target.files[0])}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported: MP3, WAV, OGG, M4A (Max 25MB)
            </p>
          </div>

          <button
            type="submit"
            disabled={testLoading || !testAudioFile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testLoading ? "Transcribing..." : "Test Transcription"}
          </button>

          {testResult && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                testResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {testResult.success ? (
                <>
                  <h3 className="font-bold text-green-800 mb-2">
                    Transcription Successful!
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Text:</strong> {testResult.result.text}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Duration:</strong>{" "}
                    {testResult.result.audioSeconds}s | <strong>Cost:</strong> $
                    {testResult.result.cost.toFixed(4)} |{" "}
                    <strong>Account:</strong> {testResult.result.accountUsed}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-red-800 mb-2">
                    Transcription Failed
                  </h3>
                  <p className="text-sm text-red-700">
                    {testResult.error || testResult.message}
                  </p>
                </>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add AssemblyAI Account</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Key *
                </label>
                <input
                  type="text"
                  value={addForm.apiKey}
                  onChange={(e) =>
                    setAddForm({ ...addForm, apiKey: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter AssemblyAI API key"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Name (optional)
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="My AssemblyAI Account"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({ apiKey: "", name: "" });
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
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="active">Active</option>
                  <option value="exhausted">Exhausted</option>
                  <option value="expired">Expired</option>
                  <option value="error">Error</option>
                </select>
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
    </div>
  );
}
