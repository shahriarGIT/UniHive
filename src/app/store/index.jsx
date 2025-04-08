import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
