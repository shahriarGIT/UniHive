import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, actions) => {
      state.isLoggedIn = true;
      state.userInfo = actions.payload;
    },
    removeUserInfo: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setUserInfo, removeUserInfo } = userSlice.actions;
