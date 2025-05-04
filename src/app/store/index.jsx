import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { userReducer } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    userInfo: userReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
