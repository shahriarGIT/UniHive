"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import FeatureSlider from "./FeatureSlider";

const imageInfo = [
  {
    id: 1,
    title: "General Knowledge",
    code: "gen",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 2,
    title: "Maths",
    code: "math",
    altText: "something",
    imgUrl: "/images/category/maths-cat.png",
    width: 100,
    height: 100,
  },
  {
    id: 3,
    title: "Physics",
    code: "phy",
    altText: "something",
    imgUrl: "/images/category/physics-cat.png",
    width: 100,
    height: 100,
  },
  {
    id: 4,
    title: "Business",
    code: "bus",
    altText: "something",
    imgUrl: "/images/category/business-cat.png",
    width: 100,
    height: 100,
  },
  {
    id: 5,
    title: "Cyber Security",
    code: "cs",
    altText: "something",
    imgUrl: "/images/category/cyber-cat.png",
    width: 100,
    height: 100,
  },
  {
    id: 6,
    title: "Chemistry",
    code: "de",
    altText: "something",
    imgUrl: "/images/category/chemistry-cat.png",
    width: 100,
    height: 100,
  },
  {
    id: 7,
    title: "IT",
    code: "as",
    altText: "something",
    imgUrl: "/images/category/it-cat.png",
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
          Categories
        </h1>
      </div>
      <div>
        <FeatureSlider imagesInfo={imageInfo} />
      </div>
    </div>
  );
};

export default Features;
