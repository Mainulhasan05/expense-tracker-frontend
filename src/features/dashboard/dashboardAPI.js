import axiosInstance from "@/lib/axiosInstance";

// /api/dashboard/recent-transactions
export async function getRecentTransactions(params) {
  const { activeMonth } = params;

  const { data } = await axiosInstance.get(
    `/api/dashboard/recent-transactions/${activeMonth}`
  );
  return data;
}

// /monthly-trends
export async function getMonthlyTrends() {
  const { data } = await axiosInstance.get(`/api/dashboard/monthly-trends`);
  return data;
}

//  / getDashboardData
export async function getDashboardData(activeMonth) {
  const { data } = await axiosInstance.get(`/api/dashboard/${activeMonth}`);
  return data;
}
