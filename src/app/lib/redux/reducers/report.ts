import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface ReportState {
  date: string;
  center: string;
}

const initialState: ReportState = {
  date: dayjs(new Date()).toDate().toISOString(),
  center: "TXBSQN0FEKQ11",
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setCenter: (state, action) => {
      state.center = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDate, setCenter } = reportSlice.actions;

export const reportReducer = reportSlice.reducer;
