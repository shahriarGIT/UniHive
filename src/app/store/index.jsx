import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { userApi } from "./apis/userApi";
import { userReducer } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    userInfo: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(userApi.middleware);
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
