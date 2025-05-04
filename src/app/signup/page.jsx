"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../store";
import { useUserSignupMutation } from "../store/apis/userApi";

import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import AlertMessage from "../components/AlertMessage";
import SpinnerCircle from "../components/loader/SpinnerCircle";

const oranizationType = ["University", "School", "College", "Office"];

const cardInfo = [
  {
    id: 1,
    city: "Dhaka",
    area: [
      "Dhanmondi",
      "Uttara",
      "Demra",
      "Banani",
      "Nikunja",
      "Bashundhara",
      "Badda",
      "Mirpur",
      "Muhammodpur",
    ],
    alphabet: "D",
    img: "/images/city-title-Dhaka.webp",
  },
  {
    id: 2,
    city: "Chittagong",
    area: ["c", "b"],
    alphabet: "C",
    img: "/images/city-title-Chittagong.webp",
  },
  {
    id: 3,
    city: "Bogra",
    area: [],
    alphabet: "B",
    img: "/images/city-tile-Bogra.webp",
  },
  {
    id: 4,
    city: "Sylhet",
    area: [],
    alphabet: "S",
    img: "/images/city-title-Sylhet.webp",
  },
];

const page = () => {
  const router = useRouter();
  const [loginModal, setLoginModal] = useState(false);
  const dispatch = useAppDispatch();
  const [signUp, signUpResult] = useUserSignupMutation();
  const [isLoading, userData, userError] = useIsLoggedIn();

  useEffect(() => {
    // if (signUpResult.data?.status === "success") {
    //   router.push("/login");
    // }
    if (signUpResult.isSuccess || userData) {
      router.push("/login");
    }
  }, [userData, signUpResult]);

  const {
    register,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    console.log(watch());
    signUp(watch());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-[90vh]  grid items-center justify-center">
        <div className=" md:shadow-2xl rounded-2xl w-[26rem] px-4 py-10">
          {signUpResult?.isError && (
            <AlertMessage error errorType={errStatus} message={errMsg} />
          )}
          <h1 className="font-semibold text-xl">Sign Up</h1>
          <h3 className="text-sm font-medium text-gray-600">
            Create an account to get started
          </h3>
          <div className="mt-6 flex flex-col gap-y-4">
            <span>
              <input
                type="text"
                placeholder="First name"
                className="border-2 border-gray-600  rounded-md  flex w-full px-2 py-3 items-center"
                {...register(`${"firstname"}`, {
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
              />
              {errors?.firstname && (
                <p className="text-red-600 text-sm  ml-2">
                  {errors?.firstname?.message}
                </p>
              )}
            </span>

            <span>
              <input
                type="text"
                placeholder="Last name"
                className="border-2 border-gray-600  rounded-md  flex w-full px-2 py-3 items-center"
                {...register(`${"lastname"}`, {
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
              />
              {errors?.lastname && (
                <p className="text-red-600 text-sm  ml-2">
                  {errors?.lastname?.message}
                </p>
              )}
            </span>

            <span>
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
              <div className="w-2/3">
                <label htmlFor="organization">Select Oraganization</label>

                <select
                  id="organization"
                  className="w-full  mt-2 border-2  border-gray-600  px-2 py-3"
                  {...register(`${"organizationType"}`)}
                >
                  {oranizationType.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
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
            <span>
              <input
                type="password"
                placeholder="Confirm password"
                className="border-2  border-gray-600  rounded-md  flex w-full px-2 py-3 items-center"
                {...register(`${"passwordConfirm"}`, {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
              />
              {errors?.passwordConfirm && (
                <p className="text-red-600 text-sm  ml-2">
                  {errors?.passwordConfirm?.message}
                </p>
              )}
            </span>
          </div>

          <div className="mt-5 text-center">
            <button
              disabled={signUpResult.isLoading}
              type="submit"
              className=" rounded-md text-sm hover:bg-blue-600-dark font-medium text-center text-white border-black bg-amber-600 w-full  py-3"
            >
              {signUpResult.isLoading ? <SpinnerCircle /> : "Sign Up  "}
            </button>
            <button
              onClick={() => router.push("/login")}
              className="mt-2 outline text-sm outline-2 text-gray-700 border-gray-700 rounded-md  font-medium text-center  w-full  py-3"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default page;
