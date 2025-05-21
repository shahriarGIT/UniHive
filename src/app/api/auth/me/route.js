"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUserInfo, removeUserInfo } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store";

import jwt from "jsonwebtoken";

const useIsLoggedIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState < boolean > false;
  const [userData, setUserData] = (useState < UserState) | (null > null);
  const [userError, setUserError] = useState("");

  const userInfo = useAppSelector((state) => state.userinfo.userInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      let token = localStorage.getItem("token");
      console.log(token);

      if (token) {
        try {
          const secret = "my-ultra-secure-and-ultra-long-secret";

          const decoded = jwt.verify(token, secret);
          console.log(decoded);

          setUserData(decoded);
          dispatch(setUserInfo(decoded));
          // Proceed with authenticated actions
        } catch (error) {
          console.log("Error verifying token:", error.message);
          // Handle token verification error (e.g., redirect to login page)
        }
      } else {
        console.log("No token found in localStorage");
        // Handle case when no token is found (e.g., redirect to login page)
      }

      // if the error did not happen, if everything is alright
    })();
  }, []);

  return [isLoading, userData, userError];
};

export default useIsLoggedIn;
