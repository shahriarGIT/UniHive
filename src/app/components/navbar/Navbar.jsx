"use client";
import React, { useState, useEffect } from "react";
// import CartLogo from "./CartLogo";
import LoginLogo from "./LoginLogo";
// import PandaLogo from "../PandaLogo";
// import FoodPandaLogo from "../FoodPandaLogo";
import SearchBar from "./SearchBar";
import Link from "next/link";
// import useIsLoggedIn from "@/app/hooks/useIsLoggedIn";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { useRouter } from "next/navigation";
// import { useUserLogoutMutation } from "@/app/store/apis/userApi";
// import { removeUserInfo } from "@/app/store/slices/userSlice";
// import { useOptionClose } from "@/app/hooks/useOptionClose";
// import { cartApi, useFetchCartQuery } from "@/app/store/apis/cartApi";
import DownArrow from "./DownArrow";

const Navbar = () => {
  //   const { isLoggedIn, userInfo } = useAppSelector(
  //     (state) => state.userinfo
  //   );
  const [isLoginMenu, setIsLoginMenu] = useState(false);
  const dispatch = useAppDispatch();

  //   const {
  //     data: cartData,
  //     error: cartError,
  //     isFetching: isFetchingCart,
  //     isLoading: isCartLoading,
  //   } = useFetchCartQuery({ userId: userInfo?.id });
  //   const cartArray = cartData?.data?.data;
  const cartArray = [];
  let localCartObj = {};
  localCartObj = cartArray?.cart?.length > 0 ? cartArray.cart[0] : {};
  let totalNumberOfProducts = 0;

  totalNumberOfProducts = localCartObj?.products?.reduce(
    (acc, current) => acc + current.productQuantity,
    0
  );

  //   const [logout, result] = useUserLogoutMutation();

  const router = useRouter();

  const loginButtonHandler = () => {
    if (!userInfo) {
      router.push("/login");
    } else {
      setIsLoginMenu((prev) => !prev);
    }
  };

  const logoutButtonHandler = () => {
    // logout({});
    // dispatch(removeUserInfo());
    router.push("/");
    localStorage.removeItem("token");
  };

  const closeModal = () => {
    setIsLoginMenu(false);
  };

  //   const [modalRef] = useOptionClose({ closeModal });

  const cartHandler = () => {
    if (!localCartObj?.restaurantId) return;

    router.push(`/restaurants/${localCartObj.restaurantId}`);
  };

  const changeRouteHandler = (address) => {
    router.push(`/${address}`);
    closeModal();
  };

  return (
    <>
      {/* mobile navbar */}
      <div className="sticky lg:hidden top-0 bg-white z-[200]">
        <div className="pl-6 pr-4  bg-white flex h-16  justify-between items-center relative z-50">
          <span
            onClick={loginButtonHandler}
            title="Login"
            className="cursor-pointer"
          >
            <LoginLogo />
          </span>
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="hidden sm:block">{/* <PandaLogo /> */}</span>
            <span>{/* <FoodPandaLogo /> */}</span>
          </Link>
          <span
            title="Cart"
            className="flex cursor-pointer h-16 w-14 justify-center items-center"
            onClick={cartHandler}
          >
            {/* <CartLogo /> */}
            {/* userinfo ---------------------- */}
            <span
              className={`text-xs pl-1 ${
                true && totalNumberOfProducts > 0 ? "block" : "hidden"
              }`}
            >
              {totalNumberOfProducts}
            </span>
          </span>
        </div>
        {/* mobile search bar on delivery pages after login */}
        {/* {isLoggedIn && userInfo?.role === "user" && <SearchBar />}  */}
        {/* isLoginMenu && userInfo && () ------------- */}
        {true && true && (
          <ul className="absolute cursor-pointer bg-white left-0 top-0 mt-16 z-[300] shadow-md lg:hidden">
            <hr />
            {/* userInfo?.role  */}
            {"partner" === "partner" && (
              <li className="py-4 w-56 hover:bg-gray-50 group ">
                <Link
                  href="/"
                  className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li className="py-4 w-56 hover:bg-gray-50 group ">
              <Link
                href="/"
                className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Orders
              </Link>
            </li>{" "}
            <li className="py-4 w-56 hover:bg-gray-50 group ">
              <Link
                href="/"
                className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Profile
              </Link>
            </li>{" "}
            <li className="py-4 w-56 hover:bg-gray-50 group ">
              <Link
                href="/"
                className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Voucher
              </Link>
            </li>{" "}
            <hr />
            <li className="py-4 w-56 hover:bg-gray-50 group ">
              <span
                onClick={logoutButtonHandler}
                className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Logout
              </span>
            </li>{" "}
          </ul>
        )}
      </div>

      {/* tab + bigger navbar */}
      <div className="sticky top-0 bg-white z-[200]">
        <div className="hidden   bg-white lg:flex pl-8 pr-2  h-16  justify-between items-center shadow-md relative z-50 ">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer border-r-[1px] pr-14 border-neutral-300"
          >
            <span className="">{/* <PandaLogo /> */}</span>
            <span>{/* <FoodPandaLogo /> */}</span>
          </Link>
          {/* search bar on pc */}
          {/* isLoggedIn && userInfo?.role === "user" */}
          {true && "user" === "user" && <SearchBar />}
          {/* {true && <SearchBar />} */}

          <div className="flex  items-center ">
            <span
              onClick={loginButtonHandler}
              title="Login"
              className="flex gap-2 items-center h-16 cursor-pointer after:content-['|'] after:ml-0.5  after:text-red-500"
            >
              <LoginLogo />
              <span className="text-xs hover:text-pandaColor-dark font-semibold relative">
                {/* userInfo
                  ? userInfo?.name.toUpperCase()?.split(" ")[0] || ""
                  : "Login"*/}
                {true ? "sdfds " || "" : "Login"}
              </span>
              <span className="rotate-90 mt-[1px] lg:mt-2 ">
                {/* userInfo &&  */}
                {true && <DownArrow />}
              </span>
            </span>
            <span
              title="Cart"
              className="flex cursor-pointer h-16 w-14 justify-center items-center"
              onClick={cartHandler}
            >
              {/* <CartLogo /> */}
              {/* userInfo ---- */}
              <span
                className={`text-xs font-semibold pl-1 ${
                  true && totalNumberOfProducts > 0 ? "block" : "hidden"
                }`}
              >
                {totalNumberOfProducts}
              </span>
            </span>
          </div>
        </div>
        {/* isLoginMenu && userInfo && */}
        {isLoginMenu && true && (
          <ul
            // @ts-ignore
            // ref={modalRef}
            className="absolute cursor-pointer text-gray-500 bg-white right-16 top-0 mt-16 z-[300] shadow-md hidden lg:block"
          >
            <hr />
            {userInfo?.role === "partner" && (
              <li className="py-4 w-56 hover:bg-gray-50 group ">
                <span
                  onClick={() => changeRouteHandler("dashboard")}
                  className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
                >
                  Dashboard
                </span>
              </li>
            )}
            {userInfo?.role === "partner" ? (
              <li className="py-4 w-56 hover:bg-gray-50 group ">
                <span
                  onClick={() => changeRouteHandler("dashboard/order")}
                  className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
                >
                  Orders
                </span>
              </li>
            ) : (
              <li className="py-4 w-56 hover:bg-gray-50 group ">
                <span
                  onClick={() => changeRouteHandler("/")}
                  className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
                >
                  Orders
                </span>
              </li>
            )}
            <li className="py-4 w-56 hover:bg-gray-50 group ">
              <Link
                href="/"
                className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Profile
              </Link>
            </li>{" "}
            <li className="py-4 w-56 hover:bg-gray-50 group ">
              <Link
                href="/"
                className="pl-6 pt-5 text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Voucher
              </Link>
            </li>{" "}
            <hr />
            <li className="h-14 w-56 hover:bg-gray-50 group ">
              <span
                onClick={logoutButtonHandler}
                className="pl-6 py-4 block w-full h-full text-sm font-normal group-hover:text-pandaColor-primary"
              >
                Logout
              </span>
            </li>{" "}
          </ul>
        )}
      </div>
      {false && (
        <div className="bg-red-400 text-center fixed left-0 right-0 z-[200]">
          notice
        </div>
      )}
    </>
  );
};

export default Navbar;
