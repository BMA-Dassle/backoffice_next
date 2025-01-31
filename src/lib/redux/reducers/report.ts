import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ReportState {
  date: string;
}

const initialState: ReportState = {
  date: dayjs.tz(new Date(), "America/New_York").format("YYYY-MM-DD"),
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
