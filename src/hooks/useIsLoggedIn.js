"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import jwt from "jsonwebtoken";
import { setUserInfo } from "@/app/store/slices/userSlice";
import { useAppDispatch } from "@/app/store";

const useIsLoggedIn = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

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

  return [userData];
};

export default useIsLoggedIn;
