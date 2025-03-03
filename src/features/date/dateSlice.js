import { createSlice } from "@reduxjs/toolkit";

// Helper function to get the current month and year in "Month YYYY" format
const getCurrentMonthYear = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const initialState = {
  activeMonth: getCurrentMonthYear(), // Dynamically set the current month and year
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setActiveMonth: (state, action) => {
      state.activeMonth = action.payload;
    },
  },
});

export const { setActiveMonth } = dateSlice.actions;
export default dateSlice.reducer;
