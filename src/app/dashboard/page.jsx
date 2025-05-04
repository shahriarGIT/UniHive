"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import AdSlider from "../components/dashboard/AdSlider";
import { useAppDispatch, useAppSelector } from "../store";
import FeatureType from "../components/dashboard/ShopType";
import Features from "../components/dashboard/Features";
import CategoryCard from "../components/dashboard/CategoryCard";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [isFilter, setIsFilter] = useState(false);
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  // const isBackDropModal = useAppSelector(
  //   (state) => state.modal.isBackDropModal
  // );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  // const userInfo = useAppSelector((state) => state.userinfo.userInfo);

  const userQuery = searchParams.get("query");
  const [isLoading, userData, userError] = useIsLoggedIn();
  console.log("from dashboard 1", isLoading, userData, userError);
  console.log(isLoggedIn, userInfo, "from dashboard 2");

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     router.push("/login");
  //   }
  // }, [isLoggedIn]);

  // if (!isLoggedIn) {
  //   return (
  //     <div className="h-screen w-full flex justify-center items-center">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div className="">
      {/* container content */}

      {/* {isBackDropModal && <Modal></Modal>} */}
      {/* search modal for mobile */}

      <div className="">
        {/* sticky element */}
        {/* restaurand search */}
        <FeatureType />

        {/* <RestaurantSearchBox setIsFilter={setIsFilter} /> */}

        <AdSlider />
        <Features />
        <CategoryCard />
      </div>
    </div>
  );
};

export default Dashboard;

{
  /* <PendingOrderCard /> */
}

{
  /* {!userQuery && <AdSlider />} */
}
// <AdSlider />
{
  /* {!userQuery && <CuisineSlider />} */
}
{
  /* Recommended Section /> */
}
{
  /* {!userQuery && <RecommendedSlider />} */
}
{
  /* All Restaurant */
}
{
  /* <AllRestaurant /> */
}
