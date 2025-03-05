import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";

// google-login
export async function googleLogin({ idToken }) {
  const response = await axiosInstance.post("/api/auth/google-login", {
    idToken,
  });
  Cookies.set("finance-tracker-token", response.data.token, {
    expires: 7,
  });
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

// /api/categories/:id
export async function deleteCategory(id) {
  const response = await axiosInstance.delete(`/api/categories/${id}`);
  return response.data;
}

// /api/transactions/add
export async function addTransaction(data) {
  const response = await axiosInstance.post("/api/transactions/add", data);
  return response.data;
}

// /api/transactions/:month
export async function getTransactions(data) {
  const { activeMonth, currentPage } = data;
  const response = await axiosInstance.get(
    `/api/transactions/${activeMonth}?page=${currentPage}`
  );
  return response.data;
}

// /api/transactions/search   ?search, category, type, startDate, endDate, page = 1
export async function searchTransactions(data) {
  const response = await axiosInstance.get("/api/transactions/search", {
    params: data,
  });
  return response.data;
}

// /api/transactions/:id
export async function deleteTransaction(id) {
  const response = await axiosInstance.delete(`/api/transactions/${id}`);
  return response.data;
}
