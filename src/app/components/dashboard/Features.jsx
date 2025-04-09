"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import FeatureSlider from "./FeatureSlider";

const imageInfo = [
  {
    id: 1,
    title: "Burger",
    code: "bu",
    altText: "something",
    imgUrl: "/images/cuisines/burger.webp",
    width: 100,
    height: 100,
  },
  {
    id: 2,
    title: "Pizza",
    code: "pi",
    altText: "something",
    imgUrl: "/images/cuisines/pizza.webp",
    width: 100,
    height: 100,
  },
  {
    id: 3,
    title: "Chicken",
    code: "ch",
    altText: "something",
    imgUrl: "/images/cuisines/chicken.webp",
    width: 100,
    height: 100,
  },
  {
    id: 4,
    title: "Fast Food",
    code: "ff",
    altText: "something",
    imgUrl: "/images/cuisines/fastfood.webp",
    width: 100,
    height: 100,
  },
  {
    id: 5,
    title: "Biryani",
    code: "bi",
    altText: "something",
    imgUrl: "/images/cuisines/biryani.webp",
    width: 100,
    height: 100,
  },
  {
    id: 6,
    title: "Desert",
    code: "de",
    altText: "something",
    imgUrl: "/images/cuisines/desert.webp",
    width: 100,
    height: 100,
  },
  {
    id: 7,
    title: "Asian",
    code: "as",
    altText: "something",
    imgUrl: "/images/cuisines/asian.webp",
    width: 100,
    height: 100,
  },
  {
    id: 8,
    title: "Bangladeshi",
    code: "ba",
    altText: "something",
    imgUrl: "/images/cuisines/bangladeshi.webp",
    width: 100,
    height: 100,
  },
  {
    id: 9,
    title: "Rice Dishes",
    code: "rd",
    altText: "something",
    imgUrl: "/images/cuisines/ricedishes.webp",
    width: 100,
    height: 100,
  },
];

const Features = () => {
  let settings = {
    className: "center",
    infinite: false,
    centerPadding: "0px",
    speed: 1400,
    swipeToSlide: true,
    row: 1,
  };
  return (
    <div className="mt-14 cuisine-class ">
      <div className="pl-5 xs:pl-14 md:pl-20 translate-y-5">
        <h1 className="text-lg md:text-xl lg:text-3xl font-extralight text-gray-900">
          Your favourite cuisines
        </h1>
      </div>
      <div>
        <FeatureSlider imagesInfo={imageInfo} />
      </div>
    </div>
  );
};

export default Features;
