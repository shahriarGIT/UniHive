"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const cuisineMap = new Map();

cuisineMap.set("bd", "Bangladeshi");
cuisineMap.set("ch", "Chinese");
cuisineMap.set("in", "Indian");
cuisineMap.set("ko", "Korean");
cuisineMap.set("as", "Asian");
cuisineMap.set("pi", "Pizza");
cuisineMap.set("sn", "Snacks");

const FeatureSlider = ({ imagesInfo }) => {
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  const router = useRouter();

  useEffect(() => {
    let e = document.querySelectorAll(".cuisine-class .slick-slide");

    for (let index = 0; index < e.length; index++) {
      e[index].style.marginRight = "-6rem";

      e[index].children[0].children[0].style.width = "100px";
      e[index].children[0].children[0].style.height = "100px";
    }
  }, []);

  let settings = {
    className: "center",
    infinite: false,
    centerPadding: "0px",
    speed: 1400,
    swipeToSlide: true,
    row: 1,
  };

  const urlHandler = (code) => {
    if (urlSearchParams.get("c") === code) {
      urlSearchParams.delete("c");

      router.push(`/dashboard?${urlSearchParams}`);

      return;
    }
    urlSearchParams.set("c", code);
    router.push(`/dashboard?${urlSearchParams}`);
  };

  return (
    <div id="slider-container" className="px-20  mt-10 ">
      <Slider {...settings}>
        {imagesInfo.map((item) => (
          <div
            className="bg-slate-100 rounded-2xl mr-3 w-20 shadow-gray-300 shadow-md "
            key={item.id}
          >
            <Image
              onClick={() => urlHandler(item.code)}
              width={item.width}
              height={item.height}
              src={item.imgUrl}
              alt={item.altText}
            />

            <h2 className="text-sm text-center font-semibold">{item.title}</h2>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeatureSlider;
