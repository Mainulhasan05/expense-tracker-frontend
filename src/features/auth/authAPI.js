import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";

// google-login
export async function googleLogin({ idToken }) {
  const response = await axiosInstance.post("/api/auth/google-login", {
    idToken,
  });
  Cookies.set("finance-tracker-token", response.data.token);
  return response.data;
}

// profile
export async function getProfile() {
  const response = await axiosInstance.get("/api/auth/profile");
  return response.data;
}

// /api/categories
export async function getCategories() {
  const response = await axiosInstance.get("/api/categories");
  return response.data;
}

// /api/categories
export async function addCategory(data) {
  const response = await axiosInstance.post("/api/categories", data);
  return response.data;
}

// /api/transactions/add
export async function addTransaction(data) {
  const response = await axiosInstance.post("/api/transactions/add", data);
  return response.data;
}
