import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import dateSlice from "@/features/date/dateSlice";
import dashboardSlice from "@/features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    date: dateSlice,
    dashboard: dashboardSlice,
  },
});
