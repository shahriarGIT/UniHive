import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  score: 0,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setScore: (state, actions) => {
      state.score = actions.payload;
    },
  },
});

export const dataReducer = userDataSlice.reducer;
export const { setScore } = userDataSlice.actions;
