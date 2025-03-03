import { getRecentTransactions } from "./dashboardAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  recentTransactions: [],
  loading: false,
  error: null,
};

export const fetchRecentTransactions = createAsyncThunk(
  "dashboard/fetchRecentTransactions",
  async () => {
    return await getRecentTransactions();
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
      });
  },
});

export default dashboardSlice.reducer;
