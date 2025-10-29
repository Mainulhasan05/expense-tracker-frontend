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
