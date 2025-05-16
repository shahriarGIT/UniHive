"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import FeatureSlider from "./FeatureSlider";

const imageInfo = [
  {
    id: 1,
    title: "Poll",
    code: "bu",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 2,
    title: "Poll",
    code: "pi",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 3,
    title: "Poll",
    code: "ch",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 4,
    title: "Poll",
    code: "ff",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 5,
    title: "Poll",
    code: "bi",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 6,
    title: "Poll",
    code: "de",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 7,
    title: "Poll",
    code: "as",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 8,
    title: "Poll",
    code: "ba",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
    width: 100,
    height: 100,
  },
  {
    id: 9,
    title: "Poll",
    code: "rd",
    altText: "something",
    imgUrl: "/images/category/polls.jpg",
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
    <div className="mt-14 cuisine-class shadow-md shadow-gray-100">
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
