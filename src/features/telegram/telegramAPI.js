import axiosInstance from "@/lib/axiosInstance";

// Generate link code for Telegram connection
export async function generateLinkCode() {
  const response = await axiosInstance.post("/api/telegram/generate-link-code");
  return response.data;
}

// Get Telegram connection status
export async function getTelegramStatus() {
  const response = await axiosInstance.get("/api/telegram/status");
  return response.data;
}

// Unlink Telegram account
export async function unlinkTelegram() {
  const response = await axiosInstance.post("/api/telegram/unlink");
  return response.data;
}

// Update notification preferences
export async function updateNotificationPreferences(preferences) {
  const response = await axiosInstance.put("/api/telegram/notifications", preferences);
  return response.data;
}
