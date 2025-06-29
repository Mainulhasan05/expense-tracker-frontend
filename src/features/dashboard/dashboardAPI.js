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

// Get category-wise data
export async function getCategoryWiseData(activeMonth) {
  const endpoint = activeMonth
    ? `/api/dashboard/categories/${activeMonth}`
    : `/api/dashboard/categories`;

  const { data } = await axiosInstance.get(endpoint);
  return data;
}

// Get top categories
export async function getTopCategories(params = {}) {
  const { activeMonth, limit = 10 } = params;

  const endpoint = activeMonth
    ? `/api/dashboard/top-categories/${activeMonth}?limit=${limit}`
    : `/api/dashboard/top-categories?limit=${limit}`;

  const { data } = await axiosInstance.get(endpoint);
  return data;
}
