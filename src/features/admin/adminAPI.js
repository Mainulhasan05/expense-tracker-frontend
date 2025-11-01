import axiosInstance from "@/lib/axiosInstance";

// Get dashboard statistics
export async function getDashboardStats() {
  const response = await axiosInstance.get("/api/admin/dashboard");
  return response.data;
}

// Get all users
export async function getAllUsers({ page = 1, limit = 10, search = "", role = "", verified = "" }) {
  const response = await axiosInstance.get("/api/admin/users", {
    params: { page, limit, search, role, verified }
  });
  return response.data;
}

// Get user details
export async function getUserDetails(userId) {
  const response = await axiosInstance.get(`/api/admin/users/${userId}`);
  return response.data;
}

// Update user
export async function updateUser(userId, updates) {
  const response = await axiosInstance.put(`/api/admin/users/${userId}`, updates);
  return response.data;
}

// Delete user
export async function deleteUser(userId) {
  const response = await axiosInstance.delete(`/api/admin/users/${userId}`);
  return response.data;
}

// Get activity logs
export async function getActivityLogs(limit = 20) {
  const response = await axiosInstance.get("/api/admin/activity", {
    params: { limit }
  });
  return response.data;
}

// ===== Telegram Log Management =====

// Get all Telegram logs
export async function getAllTelegramLogs({
  page = 1,
  limit = 20,
  userId = "",
  intent = "",
  messageType = "",
  success = "",
  startDate = "",
  endDate = ""
}) {
  const response = await axiosInstance.get("/api/admin/telegram-logs", {
    params: { page, limit, userId, intent, messageType, success, startDate, endDate }
  });
  return response.data.data; // Extract data from response
}

// Get Telegram activity statistics
export async function getTelegramActivityStats() {
  const response = await axiosInstance.get("/api/admin/telegram-activity");
  return response.data.data.statistics; // Extract statistics from response
}

// Get Telegram logs for a specific user
export async function getUserTelegramLogs(userId, { page = 1, limit = 20 } = {}) {
  const response = await axiosInstance.get(`/api/admin/telegram-logs/user/${userId}`, {
    params: { page, limit }
  });
  return response.data.data; // Extract data from response
}

// Delete a specific Telegram log entry
export async function deleteTelegramLog(logId) {
  const response = await axiosInstance.delete(`/api/admin/telegram-logs/${logId}`);
  return response.data;
}

// Delete all Telegram logs for a specific user
export async function deleteUserTelegramLogs(userId) {
  const response = await axiosInstance.delete(`/api/admin/telegram-logs/user/${userId}`);
  return response.data;
}

// Restrict user from Telegram access
export async function restrictTelegramAccess(userId, reason) {
  const response = await axiosInstance.post(`/api/admin/users/${userId}/restrict-telegram`, {
    reason
  });
  return response.data;
}

// Unrestrict user from Telegram access
export async function unrestrictTelegramAccess(userId) {
  const response = await axiosInstance.post(`/api/admin/users/${userId}/unrestrict-telegram`);
  return response.data;
}
