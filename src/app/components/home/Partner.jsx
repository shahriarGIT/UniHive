import React from "react";
import Image from "next/image";
import Link from "next/link";

const Partner = () => {
  return (
    <div className="mt-[15rem] sm:mt-[12rem] md:mt-[2rem]">
      <div className="pl-3 md:pl-24   relative">
        <h2 className=" -mt-[2.5rem] md:-mt-[4.5rem]   font-extrabold text-7xl  md:text-9xl text-neutral-300 opacity-70 absolute">
          Partners
        </h2>
        <h4 className="text-black text-base md:text-3xl z-10 relative">
          You prepare the food, we handle the rest
        </h4>
      </div>
      {/* className="bg-[url('/images/home-vendor-bd.webp')] */}
      <div className="h-[25rem] relative ">
        <Image
          src="/images/home-vendor-bd-hq.webp"
          width={2000}
          height={1400}
          alt="image of chef cooking"
          className="h-full w-full object-cover bg-top"
        />
      </div>
      <div className="relative mx-auto md:ml-24 -mt-44 bg-slate-50 w-11/12 md:w-3/5 lg:w-2/5 p-10">
        <h2 className="text-2xl text-gray-800">
          List your restaurant or shop on foodpanda{" "}
        </h2>
        <h3 className="text-lg text-gray-600 pt-8">
          Would you like millions of new customers to enjoy your amazing food
          and groceries? So would we! It's simple: we list your menu and product
          lists online, help you process orders, pick them up, and deliver them
          to hungry pandas – in a heartbeat! Interested? Let's start our
          partnership today!
        </h3>

        <Link
          href="/partner-create-account"
          className="w-full block text-center rounded-md mt-6 py-3 text-white font-medium bg-pandaColor-primary"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Partner;
