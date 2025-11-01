"use client";

import { useState, useEffect } from "react";
import {
  generateLinkCode,
  getTelegramStatus,
  unlinkTelegram,
  updateNotificationPreferences,
} from "@/features/telegram/telegramAPI";
import { Send, Unlink, Copy, CheckCircle, AlertCircle, Bell, Clock } from "lucide-react";

export default function TelegramSettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [linkCode, setLinkCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [status, setStatus] = useState({
    isLinked: false,
    telegramUsername: null,
    telegramFirstName: null,
    linkedAt: null,
    notifications: {
      enabled: true,
      dailySummary: true,
      dailySummaryTime: "20:00",
      weeklyReport: true,
      budgetAlerts: true,
      expenseAdded: false,
    },
  });
  const [notificationPrefs, setNotificationPrefs] = useState({});

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await getTelegramStatus();
      setStatus(response);
      setNotificationPrefs(response.notifications || {});
    } catch (error) {
      console.error("Failed to fetch Telegram status:", error);
    }
  };

  const handleGenerateLinkCode = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await generateLinkCode();

      if (response.success) {
        setLinkCode(response.linkCode);
        setExpiresAt(response.expiresAt);
        setMessage({
          type: "success",
          text: "Link code generated! Use it in Telegram bot within 15 minutes.",
        });
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to generate link code",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to generate link code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async () => {
    const confirmMessage =
      "⚠️ Disconnect Telegram Account?\n\n" +
      "You will lose access to:\n" +
      "• Quick expense logging via Telegram\n" +
      "• Voice message support\n" +
      "• Receipt photo scanning\n" +
      "• Daily summaries and reports\n" +
      "• Conversational AI queries\n\n" +
      "You can reconnect anytime by generating a new link code.\n\n" +
      "Are you sure you want to disconnect?";

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await unlinkTelegram();

      if (response.success) {
        setMessage({
          type: "success",
          text: "✅ Telegram account disconnected successfully. You can reconnect anytime!"
        });
        setLinkCode(null);
        setExpiresAt(null);
        await fetchStatus();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to unlink Telegram account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLinkCode = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
      setMessage({ type: "success", text: "Link code copied to clipboard!" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleNotificationChange = async (key, value) => {
    const updatedPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(updatedPrefs);

    try {
      await updateNotificationPreferences(updatedPrefs);
      setMessage({ type: "success", text: "Notification preferences updated!" });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update preferences",
      });
      // Revert on error
      setNotificationPrefs(status.notifications);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Send className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold">Telegram Integration</h2>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {status.isLinked ? (
        <>
          {/* Connected Status */}
          <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-300 dark:border-green-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-3 flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-900 dark:text-green-200">
                    ✅ Connected to Telegram
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    <strong>{status.telegramFirstName}</strong>
                    {status.telegramUsername && ` (@${status.telegramUsername})`}
                  </p>
                  {status.linkedAt && (
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Connected on {new Date(status.linkedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tips for Connected Users */}
            <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
              <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">
                💡 Quick Tips - Try these in Telegram:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="text-gray-900 dark:text-gray-100 font-mono">"lunch 500tk"</p>
                  <p className="text-gray-600 dark:text-gray-400">Add expense</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="text-gray-900 dark:text-gray-100 font-mono">"show my balance"</p>
                  <p className="text-gray-600 dark:text-gray-400">View summary</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="text-gray-900 dark:text-gray-100 font-mono">"last month expense"</p>
                  <p className="text-gray-600 dark:text-gray-400">Get totals</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="text-gray-900 dark:text-gray-100 font-mono">🎤 Voice message</p>
                  <p className="text-gray-600 dark:text-gray-400">Works too!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Bell className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
              <h3 className="text-md font-semibold">Notification Preferences</h3>
            </div>

            <div className="space-y-3">
              {/* Enable Notifications Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Enable Notifications</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Receive all Telegram notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.enabled}
                    onChange={(e) => handleNotificationChange("enabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Daily Summary */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Daily Summary</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Get your daily expense summary
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.dailySummary}
                    onChange={(e) => handleNotificationChange("dailySummary", e.target.checked)}
                    disabled={!notificationPrefs.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Daily Summary Time */}
              {notificationPrefs.dailySummary && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg ml-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <p className="text-sm font-medium">Summary Time</p>
                  </div>
                  <input
                    type="time"
                    value={notificationPrefs.dailySummaryTime}
                    onChange={(e) => handleNotificationChange("dailySummaryTime", e.target.value)}
                    disabled={!notificationPrefs.enabled}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* Weekly Report */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Weekly Report</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Get weekly insights every Monday
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.weeklyReport}
                    onChange={(e) => handleNotificationChange("weeklyReport", e.target.checked)}
                    disabled={!notificationPrefs.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Budget Alerts */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Budget Alerts</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Get notified of spending patterns
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.budgetAlerts}
                    onChange={(e) => handleNotificationChange("budgetAlerts", e.target.checked)}
                    disabled={!notificationPrefs.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Expense Added Notification */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Expense Confirmation</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Confirm when expense is added
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.expenseAdded}
                    onChange={(e) => handleNotificationChange("expenseAdded", e.target.checked)}
                    disabled={!notificationPrefs.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Unlink Section */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Need to switch to a different Telegram account? You can disconnect and reconnect anytime.
            </p>
            <button
              onClick={handleUnlink}
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <Unlink className="w-4 h-4 mr-2" />
              {isLoading ? "Disconnecting..." : "Disconnect Telegram Account"}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Not Connected Status */}
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-700">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-3 flex-shrink-0">
                <Send className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-1">
                  Connect Your Telegram Account
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  Access your expense tracker anytime, anywhere with our AI-powered Telegram bot!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">✨</span>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Conversational AI - Just chat naturally</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">🎤</span>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Voice messages supported</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">🌍</span>
                    <p className="text-xs text-blue-700 dark:text-blue-300">English & Bengali languages</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">📸</span>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Receipt photo scanning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bot Information Box */}
          {status.botInfo?.username && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-300 dark:border-blue-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Our Telegram Bot
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    @{status.botInfo.username}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Search for this bot in Telegram to get started
                  </p>
                </div>
                <a
                  href={status.botInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Open in Telegram
                </a>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <strong>Quick Start:</strong> Open Telegram → Search for <code className="bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400">@{status.botInfo.username}</code> → Start chat
                </p>
              </div>
            </div>
          )}

          {/* Link Code Display */}
          {linkCode && (
            <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-sm font-bold text-green-900 dark:text-green-200">
                  Link Code Generated! 🎉
                </p>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <code className="flex-1 px-4 py-3 text-2xl font-mono font-bold text-center bg-white dark:bg-gray-800 rounded-lg border-2 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400 tracking-wider">
                  {linkCode}
                </code>
                <button
                  onClick={handleCopyLinkCode}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-300 dark:border-yellow-700 mb-4">
                <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Expires: {new Date(expiresAt).toLocaleTimeString()} ({Math.floor((new Date(expiresAt) - new Date()) / 60000)} minutes remaining)
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2">📋 Connection Steps:</p>
                <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-2">
                  <li>
                    Open Telegram and search for{" "}
                    <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-semibold">
                      @{status.botInfo?.username || 'our bot'}
                    </code>
                  </li>
                  <li>
                    Click "Start" or type{" "}
                    <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-semibold">
                      /start
                    </code>
                  </li>
                  <li>
                    Type:{" "}
                    <code className="bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded text-green-700 dark:text-green-300 font-semibold">
                      /link {linkCode}
                    </code>
                  </li>
                  <li className="text-green-700 dark:text-green-400 font-semibold">✅ Done! Your account will be connected instantly</li>
                </ol>
              </div>
            </div>
          )}

          {/* Generate Link Code Button */}
          <button
            onClick={handleGenerateLinkCode}
            disabled={isLoading}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Generating..." : "Generate Link Code"}
          </button>

          {/* Features Info Box */}
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🤖</span>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                AI-Powered Conversational Features
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">💬 Chat Naturally:</p>
                <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <p>"lunch 500tk" - Add expense</p>
                  <p>"show my balance" - View balance</p>
                  <p>"show last month expenses" - Get totals</p>
                  <p>"add a category called Travel" - Create category</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">🎤 Voice Support:</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">Send voice messages in English or Bengali - AI will understand and process</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">📸 Smart Features:</p>
                <ul className="text-xs text-blue-700 dark:text-blue-400 list-disc list-inside space-y-0.5">
                  <li>Upload receipt photos for automatic OCR extraction</li>
                  <li>Query your data: expenses by category, time period, type</li>
                  <li>Get daily summaries and weekly financial reports</li>
                  <li>Receive budget alerts and spending insights</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">🌏 Bilingual:</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">Full support for English and Bengali (বাংলা) - type in either language!</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                No rigid commands - just chat like you would with a friend! 🚀
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
