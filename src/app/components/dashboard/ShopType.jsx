"use client";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

const FeatureType = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const url = new URLSearchParams(Array.from(searchParams.entries()));
  //   const userInfo = useAppSelector((state) => state.userinfo.userInfo);

  const urlDeliveryHandler = () => {
    // if (url.get("type") !== "delivery") {
    //   url.delete("type");
    //   url.append("type", "delivery");
    //   router.push(`${pathname}?${url.toString()}`);
    // }
    router.push("dashboard/quiz");
  };
  const urlPickupHandler = () => {
    // if (url.get("type") !== "polling") {
    //   url.delete("type");
    //   url.append("type", "polling");
    //   router.push(`${pathname}?${url.toString()}`);
    // }
    router.push("dashboard/vote");
  };
  const urlShopHandler = () => {
    // if (url.get("type") !== "pandashop") {
    //   url.delete("type");
    //   url.append("type", "pandashop");
    //   router.push(`${pathname}?${url.toString()}`);
    // }
    router.push("dashboard/flashcard");
  };

  // router.push(`${pathname}?${url.toString()}`);
  // userInfo?.role != "user"

  return (
    <div
      className={`lg:mt-10 lg:ml-20    bg-white  z-[120] lg:z-20 ${
        "user" != "user"
          ? "sticky lg:relative  top-16 lg:top-0"
          : "sticky lg:relative  top-36 lg:top-0"
      }`}
    >
      <ul className=" justify-center  mx-auto md:max-w-3xl lg:justify-start lg:mx-0 lg:gap-4  flex text-center">
        <li className="flex-1 group h-[4.5rem] lg:h-14  relative lg:bg-slate-100 hover:bg-white lg:hover:shadow-lg lg:bg-[url('/images/features/poll-3d.png')] bg-contain bg-no-repeat bg-fit bg-right">
          <button
            onClick={urlPickupHandler}
            className={`h-full w-full  lg:text-left lg:pt-4 lg:pl-6 focus:before:block focus:before:h-[2px] group-hover:before:block     before:content-[''] before:absolute   before:h-[2px] before:bg-pandaColor-primary before:w-full before:left-0 before:bottom-0   focus:text-pandaColor-primary focus:font-semibold group-hover:text-pandaColor-primary text-sm text-slate-700 group-hover:font-semibold  ${
              searchParams.get("type") === "polling" ? "  " : "before:hidden"
            }`}
          >
            Polling
          </button>
        </li>
        <li className="flex-1 group h-[4.5rem] lg:h-14  relative lg:bg-slate-50 hover:bg-white   lg:hover:shadow-lg lg:bg-[url('/images/features/quiz.png')] bg-contain bg-no-repeat bg-fit bg-right">
          <button
            onClick={urlDeliveryHandler}
            className={`h-full w-full  lg:text-left lg:pt-4 lg:pl-6   group-hover:before:block before:content-[''] before:absolute before:bg-pandaColor-primary before:h-[2px] before:w-full before:left-0 before:bottom-0 focus:before:block focus:before:h-[2px] focus:text-pandaColor-primary focus:font-semibold group-hover:text-pandaColor-primary text-sm text-slate-700 group-hover:font-semibold  ${
              searchParams.get("type") === "quiz" || !searchParams.get("type")
                ? " "
                : "before:hidden"
            }`}
          >
            Quiz
          </button>
        </li>

        <li className="flex-1 group h-[4.5rem] lg:h-14  relative lg:bg-slate-100 hover:bg-white  lg:hover:shadow-lg lg:bg-[url('/images/features/flashcard-3d.png')] bg-contain bg-no-repeat bg-right">
          <button
            onClick={urlShopHandler}
            className={`h-full w-full lg:text-left lg:pt-4 lg:pl-6   group-hover:before:block before:content-[''] before:absolute before:bg-pandaColor-primary before:h-[2px] before:w-full before:left-0 before:bottom-0 focus:before:block focus:before:h-[2px] focus:text-pandaColor-primary focus:font-semibold group-hover:text-pandaColor-primary text-sm  text-slate-700 group-hover:font-semibold ${
              searchParams.get("type") === "flashcard" ? "  " : "before:hidden"
            }`}
          >
            Flashcard
          </button>
        </li>
      </ul>
    </div>
  );
};

export default FeatureType;
