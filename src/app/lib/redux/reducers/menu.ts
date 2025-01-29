import { createSlice } from "@reduxjs/toolkit";

interface MenuState {
  hidden: boolean,
}

const initialState: MenuState = {
  hidden: false,
}

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setHidden: (state, action) => {
      state.hidden = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { setHidden } = menuSlice.actions;

export const menuReducer = menuSlice.reducer;