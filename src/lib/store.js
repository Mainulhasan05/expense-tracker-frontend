import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
// import categoryReducer from "@/features/categories/categorySlice";
// import transactionReducer from "@/features/transactions/transactionSlice";
// import taskReducer from "@/features/tasks/taskSlice";
// import dashboardReducer from "@/features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // categories: categoryReducer,
    // transactions: transactionReducer,
    // tasks: taskReducer,
    // dashboard: dashboardReducer,
  },
});
