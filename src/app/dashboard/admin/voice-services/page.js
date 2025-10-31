"use client";

import { useState, useEffect } from "react";
import {
  getAllAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  testTranscription,
  testTTS,
  getVoices,
} from "@/features/admin/voiceServiceAPI";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Music,
  RefreshCw,
  Mic,
  Volume2,
  Star,
} from "lucide-react";

export default function VoiceServiceManagement() {
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [testAudioFile, setTestAudioFile] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testText, setTestText] = useState("");
  const [ttsResult, setTtsResult] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  // Add account form
  const [addForm, setAddForm] = useState({
    provider: "speechmatics",
    apiKey: "",
    name: "",
    priority: "",
    totalCredits: "0",
    planType: "trial",
    language: "bn",
    operatingPoint: "standard",
    modelId: "eleven_multilingual_v2",
    notes: "",
  });

  // Edit account form
  const [editForm, setEditForm] = useState({
    name: "",
    status: "",
    priority: "",
    config: {},
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
      setStats(data.stats || null);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load accounts"
      );
      setAccounts([]);
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
      const accountData = {
        provider: addForm.provider,
        apiKey: addForm.apiKey,
        name: addForm.name || `${addForm.provider} Account`,
        priority: addForm.priority ? parseInt(addForm.priority) : undefined,
        totalCredits: parseFloat(addForm.totalCredits) || 0,
        planType: addForm.planType,
        notes: addForm.notes,
        config: {},
      };

      // Add provider-specific config
      if (addForm.provider === "speechmatics") {
        accountData.config.language = addForm.language;
        accountData.config.operatingPoint = addForm.operatingPoint;
      } else if (addForm.provider === "elevenlabs") {
        accountData.config.modelId = addForm.modelId;
      }

      await addAccount(accountData);
      setShowAddModal(false);
      setAddForm({
        provider: "speechmatics",
        apiKey: "",
        name: "",
        priority: "",
        totalCredits: "0",
        planType: "trial",
        language: "bn",
        operatingPoint: "standard",
        modelId: "eleven_multilingual_v2",
        notes: "",
      });
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
      priority: account.priority.toString(),
      config: account.config,
    });
    setShowEditModal(true);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    try {
      const updates = {
        name: editForm.name,
        status: editForm.status,
        priority: parseInt(editForm.priority),
        config: editForm.config,
      };

      await updateAccount(selectedAccount.id, updates);
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

  const handleTestTTS = async (e) => {
    e.preventDefault();

    if (!testText.trim()) {
      alert("Please enter some text");
      return;
    }

    try {
      setTtsLoading(true);
      setTtsResult(null);
      const result = await testTTS(testText);
      setTtsResult(result);

      // Play the audio
      if (result.success && result.audioData) {
        const audioBlob = base64ToBlob(result.audioData, "audio/mpeg");
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error("Error testing TTS:", error);
      setTtsResult({
        success: false,
        error: error.response?.data?.message || "TTS failed",
      });
    } finally {
      setTtsLoading(false);
    }
  };

  const base64ToBlob = (base64, type) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
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
      case "disabled":
        return <XCircle className="w-5 h-5 text-gray-600" />;
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
      disabled: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getProviderBadge = (provider) => {
    const colors = {
      speechmatics: "bg-blue-100 text-blue-800",
      elevenlabs: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[provider]}`}
      >
        {provider === "speechmatics" ? "Speechmatics" : "ElevenLabs"}
      </span>
    );
  };

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
            Voice Service Management
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Speechmatics (Transcription) & ElevenLabs (Text-to-Speech)
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

      {/* Provider Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Speechmatics (Transcription)</h3>
              <Mic className="w-8 h-8 opacity-80" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-80">Accounts</p>
                <p className="text-2xl font-bold">{stats.speechmatics?.total || 0}</p>
                <p className="text-xs opacity-80">{stats.speechmatics?.active || 0} active</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Requests</p>
                <p className="text-2xl font-bold">{stats.speechmatics?.totalRequests || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Audio Hours</p>
                <p className="text-2xl font-bold">
                  {((stats.speechmatics?.totalAudioSeconds || 0) / 3600).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">ElevenLabs (TTS)</h3>
              <Volume2 className="w-8 h-8 opacity-80" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-80">Accounts</p>
                <p className="text-2xl font-bold">{stats.elevenlabs?.total || 0}</p>
                <p className="text-xs opacity-80">{stats.elevenlabs?.active || 0} active</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Requests</p>
                <p className="text-2xl font-bold">{stats.elevenlabs?.totalRequests || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Characters</p>
                <p className="text-2xl font-bold">
                  {(stats.elevenlabs?.totalCharacters || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Config
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
                        {account.notes && (
                          <p className="text-xs text-gray-500">{account.notes}</p>
                        )}
                        {account.lastError && (
                          <p className="text-xs text-red-600">
                            Error: {account.lastError.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getProviderBadge(account.provider)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Star
                        className={`w-4 h-4 ${account.priority >= 10 ? "text-yellow-500" : "text-gray-400"}`}
                      />
                      <span className="font-medium">{account.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(account.status)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p>{account.totalRequests} requests</p>
                      {account.provider === "speechmatics" ? (
                        <p className="text-gray-600">
                          {account.totalAudioHours}h audio
                        </p>
                      ) : (
                        <p className="text-gray-600">
                          {account.totalCharactersGenerated.toLocaleString()} chars
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      {account.provider === "speechmatics" && (
                        <>
                          <p>
                            <span className="font-medium">Language:</span>{" "}
                            {account.config.language}
                          </p>
                          <p>
                            <span className="font-medium">Mode:</span>{" "}
                            {account.config.operatingPoint}
                          </p>
                        </>
                      )}
                      {account.provider === "elevenlabs" && (
                        <p>
                          <span className="font-medium">Model:</span>{" "}
                          {account.config.modelId}
                        </p>
                      )}
                    </div>
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
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No voice service accounts configured. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Transcription */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Test Transcription</span>
          </h2>
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
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Duration:</strong> {testResult.result.audioSeconds}s
                      </p>
                      <p>
                        <strong>Provider:</strong> {testResult.result.provider}
                      </p>
                      <p>
                        <strong>Account:</strong> {testResult.result.accountUsed}
                      </p>
                      <p>
                        <strong>Language:</strong>{" "}
                        {testResult.result.language || "Auto-detected"}
                      </p>
                    </div>
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

        {/* Test TTS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Test Text-to-Speech</span>
          </h2>
          <form onSubmit={handleTestTTS} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Text (English/Bengali)
              </label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows="4"
                placeholder="আমার খরচ ৫০০ টাকা খাবার এর জন্য"
              />
            </div>

            <button
              type="submit"
              disabled={ttsLoading || !testText.trim()}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ttsLoading ? "Generating..." : "Generate Speech"}
            </button>

            {ttsResult && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  ttsResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {ttsResult.success ? (
                  <>
                    <h3 className="font-bold text-green-800 mb-2">
                      TTS Successful!
                    </h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Characters:</strong> {ttsResult.characters}
                      </p>
                      <p>
                        <strong>Provider:</strong> {ttsResult.provider}
                      </p>
                      <p>
                        <strong>Account:</strong> {ttsResult.accountUsed}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Audio is playing automatically
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-red-800 mb-2">TTS Failed</h3>
                    <p className="text-sm text-red-700">
                      {ttsResult.error || ttsResult.message}
                    </p>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4">
            <h2 className="text-xl font-bold mb-4">Add Voice Service Account</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Provider *
                  </label>
                  <select
                    value={addForm.provider}
                    onChange={(e) =>
                      setAddForm({ ...addForm, provider: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="speechmatics">
                      Speechmatics (Transcription)
                    </option>
                    <option value="elevenlabs">ElevenLabs (TTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Plan Type
                  </label>
                  <select
                    value={addForm.planType}
                    onChange={(e) =>
                      setAddForm({ ...addForm, planType: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="free">Free</option>
                    <option value="trial">Trial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

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
                  placeholder="Enter API key"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="My Account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority (Higher = Used First)
                  </label>
                  <input
                    type="number"
                    value={addForm.priority}
                    onChange={(e) =>
                      setAddForm({ ...addForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="10 for Speechmatics, 5 for ElevenLabs"
                  />
                </div>
              </div>

              {/* Provider-specific config */}
              {addForm.provider === "speechmatics" && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Language
                    </label>
                    <select
                      value={addForm.language}
                      onChange={(e) =>
                        setAddForm({ ...addForm, language: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="bn">Bengali (বাংলা)</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Operating Point
                    </label>
                    <select
                      value={addForm.operatingPoint}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          operatingPoint: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="standard">Standard</option>
                      <option value="enhanced">Enhanced</option>
                    </select>
                  </div>
                </div>
              )}

              {addForm.provider === "elevenlabs" && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Model ID
                  </label>
                  <select
                    value={addForm.modelId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, modelId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="eleven_multilingual_v2">
                      Multilingual V2 (Supports Bengali)
                    </option>
                    <option value="eleven_monolingual_v1">
                      Monolingual V1 (English Only)
                    </option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
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

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({
                      provider: "speechmatics",
                      apiKey: "",
                      name: "",
                      priority: "",
                      totalCredits: "0",
                      planType: "trial",
                      language: "bn",
                      operatingPoint: "standard",
                      modelId: "eleven_multilingual_v2",
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
                <label className="block text-sm font-medium mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({ ...editForm, priority: e.target.value })
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
                  <option value="disabled">Disabled</option>
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
