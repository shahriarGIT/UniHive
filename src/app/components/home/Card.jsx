"use client";

import React, { use } from "react";
import Image from "next/image";

import Link from "next/link";

const CityCard = ({ city, alphabet, img }) => {
  return (
    <div className="relative shrink-0 w-[16rem] h-[20rem]   group overflow-hidden ">
      <Link href="/" className=" ">
        <div className="bg-black w-full h-full">
          <Image
            src={img}
            width={600}
            height={400}
            alt="image of chef cooking"
            className="h-full w-full object-cover group-hover:scale-105 overflow-hidden"
          />
        </div>
        <span className="absolute hidden group-hover:block  opacity-60 bottom-0 left-0 text-[15rem] -translate-x-[15px] translate-y-24 -pl-16  text-pandaColor-light font-bold">
          {alphabet}
        </span>
        <span className="absolute bottom-0 left-0 text-2xl pl-5 pb-4  text-white font-bold">
          {city}
        </span>
      </Link>
    </div>
  );
};

export default CityCard;
