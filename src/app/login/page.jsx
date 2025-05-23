"use client";
import React, { useState, useEffect } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import Spinner from "../components/Spinner";
import SpinnerCircle from "../components/loader/SpinnerCircle";
import AlertMessage from "../components/AlertMessage";
import {
  useUserLoginMutation,
  useUserLogoutMutation,
  useUserSignupMutation,
} from "@/app/store/apis/userApi";
import { useAppDispatch, useAppSelector } from "../store";

const page = () => {
  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();
  const {
    register,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();
  const [login, loginResult] = useUserLoginMutation();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  useEffect(() => {
    if (loginResult?.data?.status === "success") {
      localStorage.setItem("token", loginResult?.data?.token);
      router.push("/dashboard");
    }
    if (userInfo) {
      router.push("/dashboard");
    }
  }, [userInfo, loginResult]);

  if (isLoading) {
    return <Spinner height="85vh" />;
  }

  const onSubmit = () => {
    console.log(watch());
    login(watch());
  };

  let errStatus, errMsg;
  if (loginResult?.isError && loginResult?.error) {
    // Use a type guard or assertion to narrow down the type
    if (
      "data" in loginResult.error &&
      loginResult.error.data === "object" &&
      loginResult.error.data !== null
    ) {
      // Now you can safely access the 'data' object properties
      const data = loginResult.error.data;
      if ("message" in data && "status" in data) {
        errStatus = data.status;
        errMsg = data.message;
      }
    }
  }

  return (
    <div className="h-[90vh]  grid items-center justify-center">
      {!loginModal && (
        <div className=" md:shadow-2xl rounded-2xl w-[26rem] px-4 py-10">
          <h1 className="font-semibold text-xl">Welcome!</h1>
          <h3 className="text-sm font-medium text-gray-600">
            Sign up or log in to continue
          </h3>
          <div className="mt-10">
            <button className="border-2 border-black  flex w-full px-2 py-3 items-center">
              <FcGoogle className="mr-20" />
              <span className="">Continue with Google</span>
            </button>
            <button className="border-2 border-blue-700 mt-5  flex w-full px-2 py-3 items-center">
              <FaFacebook className="mr-20 text-blue-800" />
              <span className="">Continue with Facebook</span>
            </button>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setLoginModal((prev) => !prev)}
              className=" rounded-md text-sm hover:bg-indigo-500 font-medium text-center text-white border-black bg-indigo-600 w-full  py-3"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="mt-2 outline text-sm outline-2 text-pandaColor-primary border-pandaColor-primary rounded-md hover:outline-none font-medium text-center  w-full  py-3"
            >
              Sign Up
            </button>
          </div>
          <h2 className="mt-3 text-sm text-gray-600 font-medium">
            By signing up, you agree to our{" "}
            <span className="text-pandaColor-primary cursor-pointer">
              Terms and Conditions
            </span>{" "}
            and{" "}
            <span className="text-pandaColor-primary cursor-pointer">
              Privacy Policy.
            </span>
          </h2>
        </div>
      )}

      {loginModal && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" md:shadow-2xl rounded-2xl w-[26rem] px-4 py-10">
            {loginResult?.isError && (
              <AlertMessage error errorType={errStatus} message={errMsg} />
            )}
            <h1 className="font-semibold text-xl">Login</h1>
            <h3 className="text-sm font-medium text-gray-600">
              Enter your email and password
            </h3>
            <div className="mt-6 flex flex-col gap-y-5">
              <span className="">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="border-2 border-gray-600  rounded-md  flex w-full px-2 py-3 items-center"
                  {...register(`${"email"}`, {
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                  })}
                />
                {errors?.email && (
                  <p className="text-red-600 text-sm  ml-2">
                    {errors?.email?.message}
                  </p>
                )}
              </span>
              <span>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="border-2 border-gray-600  rounded-md  flex w-full px-2 py-3 items-center"
                  {...register(`${"password"}`, {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  })}
                />
                {errors?.password && (
                  <p className="text-red-600 text-sm  ml-2">
                    {errors?.password?.message}
                  </p>
                )}
              </span>
            </div>

            <div className="mt-5 text-center">
              <button
                disabled={loginResult.isLoading}
                type="submit"
                className=" rounded-md text-sm hover:bg-indigo-500  font-medium text-center text-white border-black bg-indigo-600  w-full  py-3"
              >
                {loginResult.isLoading ? <SpinnerCircle /> : "Log In"}
              </button>
              <button
                onClick={() => setLoginModal((prev) => !prev)}
                className="mt-2 outline text-sm outline-2 text-gray-700 border-gray-700 rounded-md  font-medium text-center  w-full  py-3"
              >
                Back
              </button>
            </div>
            <h2 className="mt-3 text-sm text-gray-600 font-medium">
              <span className="text-pandaColor-primary cursor-pointer">
                Forgot Password?{" "}
              </span>{" "}
            </h2>
          </div>
        </form>
      )}
    </div>
  );
};

export default page;
