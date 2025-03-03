import axiosInstance from "@/lib/axiosInstance";

// /api/dashboard/recent-transactions
export async function getRecentTransactions() {
  const { data } = await axiosInstance.get("/dashboard/recent-transactions");
  return data;
}
