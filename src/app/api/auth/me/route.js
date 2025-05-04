"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUserInfo, removeUserInfo } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store";

import { useCookies } from "react-cookie";

import { getCookie } from "cookies-next";

import jwt from "jsonwebtoken";

import Cookies from "js-cookie";

const useIsLoggedIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState < boolean > false;
  const [userData, setUserData] = (useState < UserState) | (null > null);
  const [userError, setUserError] = useState("");

  const userInfo = useAppSelector((state) => state.userinfo.userInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // const data: any = await getUser();
      /*
      getUser()
        .then((data: any) => {
          // console.log(data, "from eefffect");
          console.log(data, "from eefffect");

          if (!data) {
            return new Error("Please Log in");
          }
          setUserData(data);
          console.log( data, "set data state from hook");
          
          dispatch(setUserInfo(data)) ;
        //   router.push("/restaurants");
    
        })
        .catch((e) => {
            setUserError(e);
            setUserData(null);
            dispatch(removeUserInfo()) ;


        //   router.push("/login");
        }).finally(() => {
          setIsLoading(false);

        });
*/

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
