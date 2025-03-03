import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeMonth: "March 2025",
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
