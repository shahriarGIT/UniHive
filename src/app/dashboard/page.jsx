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

  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();

  const userQuery = searchParams.get("query");
  const [isLoading, userData, userError] = useIsLoggedIn();
  console.log("from dashboard 1", isLoading, userData, userError);
  console.log(isLoggedIn, userInfo, "from dashboard 2");

  return (
    <div className="">
      {/* container content */}

      <div className="">
        {/* sticky element */}
        <FeatureType />

        <AdSlider />
        <Features />
        <CategoryCard />
      </div>
    </div>
  );
};

export default Dashboard;
