import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface ReportState {
  date: string;
}

const initialState: ReportState = {
  date: dayjs(new Date()).toDate().toISOString(),
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDate } = reportSlice.actions;

export const reportReducer = reportSlice.reducer;
