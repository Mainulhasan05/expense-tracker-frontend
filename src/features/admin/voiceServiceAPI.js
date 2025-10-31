import axiosInstance from "@/lib/axiosInstance";

/**
 * Get all voice service accounts
 */
export const getAllAccounts = async () => {
  const response = await axiosInstance.get("/api/admin/voice/accounts");
  return response.data;
};

/**
 * Add new voice service account
 */
export const addAccount = async (accountData) => {
  const response = await axiosInstance.post("/api/admin/voice/accounts", accountData);
  return response.data;
};

/**
 * Update voice service account
 */
export const updateAccount = async (id, updates) => {
  const response = await axiosInstance.put(`/api/admin/voice/accounts/${id}`, updates);
  return response.data;
};

/**
 * Delete voice service account
 */
export const deleteAccount = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/voice/accounts/${id}`);
  return response.data;
};

/**
 * Get provider statistics
 */
export const getStats = async () => {
  const response = await axiosInstance.get("/api/admin/voice/stats");
  return response.data;
};

/**
 * Test transcription with audio file
 */
export const testTranscription = async (audioFile) => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const response = await axiosInstance.post("/api/admin/voice/test/transcription", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Test TTS with text
 */
export const testTTS = async (text) => {
  const response = await axiosInstance.post("/api/admin/voice/test/tts", { text });
  return response.data;
};

/**
 * Get available voices for ElevenLabs account
 */
export const getVoices = async (accountId) => {
  const response = await axiosInstance.get(`/api/admin/voice/accounts/${accountId}/voices`);
  return response.data;
};
