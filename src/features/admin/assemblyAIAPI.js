import axiosInstance from "@/lib/axiosInstance";

/**
 * Get all AssemblyAI accounts
 */
export async function getAllAccounts() {
  const response = await axiosInstance.get("/api/admin/assemblyai/accounts");
  return response.data;
}

/**
 * Add new AssemblyAI account
 */
export async function addAccount(apiKey, name) {
  const response = await axiosInstance.post("/api/admin/assemblyai/accounts", {
    apiKey,
    name,
  });
  return response.data;
}

/**
 * Update AssemblyAI account
 */
export async function updateAccount(id, updates) {
  const response = await axiosInstance.put(
    `/api/admin/assemblyai/accounts/${id}`,
    updates
  );
  return response.data;
}

/**
 * Delete AssemblyAI account
 */
export async function deleteAccount(id) {
  const response = await axiosInstance.delete(
    `/api/admin/assemblyai/accounts/${id}`
  );
  return response.data;
}

/**
 * Test transcription with audio file
 */
export async function testTranscription(audioFile) {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const response = await axiosInstance.post(
    "/api/admin/assemblyai/test",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}
