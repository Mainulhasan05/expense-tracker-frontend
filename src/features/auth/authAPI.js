import axiosInstance from "@/lib/axiosInstance";

// google-login
export async function googleLogin({ idToken }) {
  const response = await axiosInstance.post("/api/auth/google-login", {
    idToken,
  });
  return response.data;
}
