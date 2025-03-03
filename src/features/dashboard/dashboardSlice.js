import {
  getRecentTransactions,
  getMonthlyTrends,
  getDashboardData,
} from "./dashboardAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: {},
  recentTransactions: [],
  monthlyTrends: [],
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
      });
  },
});

export default dashboardSlice.reducer;
