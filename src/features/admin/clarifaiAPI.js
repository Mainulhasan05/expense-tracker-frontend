import axiosInstance from "@/lib/axiosInstance";

/**
 * Get all Clarifai accounts
 */
export async function getAllAccounts() {
  const response = await axiosInstance.get("/api/admin/clarifai/accounts");
  return response.data;
}

/**
 * Add a new Clarifai account
 */
export async function addAccount(accountData) {
  const response = await axiosInstance.post("/api/admin/clarifai/accounts", accountData);
  return response.data;
}

/**
 * Update an existing Clarifai account
 */
export async function updateAccount(id, updates) {
  const response = await axiosInstance.put(`/api/admin/clarifai/accounts/${id}`, updates);
  return response.data;
}

/**
 * Delete a Clarifai account
 */
export async function deleteAccount(id) {
  const response = await axiosInstance.delete(`/api/admin/clarifai/accounts/${id}`);
  return response.data;
}

/**
 * Test a Clarifai account
 */
export async function testAccount(id) {
  const response = await axiosInstance.post(`/api/admin/clarifai/test/${id}`);
  return response.data;
}

/**
 * Get usage statistics
 */
export async function getUsageStats() {
  const response = await axiosInstance.get("/api/admin/clarifai/usage-stats");
  return response.data;
}

/**
 * Test message parsing
 */
export async function testParsing(message, categories = []) {
  const response = await axiosInstance.post("/api/admin/clarifai/test-parsing", {
    message,
    categories,
  });
  return response.data;
}
