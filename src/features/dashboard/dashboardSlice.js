import {
  getRecentTransactions,
  getMonthlyTrends,
  getDashboardData,
  getCategoryWiseData,
  getTopCategories,
} from "./dashboardAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: {},
  recentTransactions: [],
  monthlyTrends: [],
  categoryWiseData: {
    expenses: { categories: [], total: 0 },
    income: { categories: [], total: 0 },
  },
  topCategories: [],
  loading: false,
  error: null,
};

export const fetchRecentTransactions = createAsyncThunk(
  "dashboard/fetchRecentTransactions",
  async (data) => {
    return await getRecentTransactions(data);
  }
);

export const fetchMonthlyTrends = createAsyncThunk(
  "dashboard/fetchMonthlyTrends",
  async () => {
    return await getMonthlyTrends();
  }
);

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (activeMonth) => {
    return await getDashboardData(activeMonth);
  }
);

export const fetchCategoryWiseData = createAsyncThunk(
  "dashboard/fetchCategoryWiseData",
  async (activeMonth) => {
    return await getCategoryWiseData(activeMonth);
  }
);

export const fetchTopCategories = createAsyncThunk(
  "dashboard/fetchTopCategories",
  async (params) => {
    return await getTopCategories(params);
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.recentTransactions = action.payload;
      })
      .addCase(fetchRecentTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMonthlyTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlyTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTrends = action.payload;
      })
      .addCase(fetchMonthlyTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategoryWiseData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryWiseData.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryWiseData = action.payload;
      })
      .addCase(fetchCategoryWiseData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTopCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.topCategories = action.payload;
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
