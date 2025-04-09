"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import AdSlider from "../components/dashboard/AdSlider";
import { useAppDispatch, useAppSelector } from "../store";
import ShopType from "../components/dashboard/ShopType";
import Features from "../components/dashboard/Features";

const Dashboard = () => {
  const [isFilter, setIsFilter] = useState(false);

  // const isBackDropModal = useAppSelector(
  //   (state) => state.modal.isBackDropModal
  // );
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  // const userInfo = useAppSelector((state) => state.userinfo.userInfo);

  const userQuery = searchParams.get("query");

  return (
    <div className="">
      {/* container content */}

      {/* {isBackDropModal && <Modal></Modal>} */}
      {/* search modal for mobile */}

      <div className="">
        {/* sticky element */}
        {/* restaurand search */}
        <ShopType />

        {/* <RestaurantSearchBox setIsFilter={setIsFilter} /> */}

        <AdSlider />
        <Features />
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
