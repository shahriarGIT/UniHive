import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { userApi } from "./apis/userApi";
import { userReducer } from "./slices/userSlice";
import { dataReducer } from "./slices/dataSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here

    userInfo: userReducer,
    userData: dataReducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(userApi.middleware);
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
