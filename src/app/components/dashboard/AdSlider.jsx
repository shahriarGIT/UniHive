"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { useEffect } from "react";

const addInfo = [
  {
    id: 1,
    title: "Ad1",
    altText: "something",
    imgUrl: "/images/ad/cp.png",
  },
  {
    id: 2,
    title: "Ad1",
    altText: "something",
    imgUrl: "/images/ad/card.png",
  },
  {
    id: 3,
    title: "Ad1",
    altText: "something",
    imgUrl: "/images/ad/fcard.png",
  },
  {
    id: 4,
    title: "Ad1",
    altText: "something",
    imgUrl: "/images/ad/fc.png",
  },
  {
    id: 5,
    title: "Ad1",
    altText: "something",
    imgUrl: "/images/ad/quiz.png",
  },
  {
    id: 6,
    title: "Ad1",
    altText: "something",
    imgUrl: "/images/ad/quizp.png",
  },
];

const AdSlider = () => {
  useEffect(() => {
    let e = document.querySelectorAll(".adslider-class .slick-slide");

    if (e) {
      for (let index = 0; index < e.length; index++) {
        e[index].style.marginRight = "4.5rem";

        e[index].children[0].children[0].style.width = "18rem";
      }
    }
  }, []);

  let settings = {
    className: "center",
    infinite: false,
    centerPadding: "0px",
    speed: 1400,
    swipeToSlide: true,
  };

  return (
    <>
      <div id="slider-container" className="adslider-class  px-20  mt-10">
        <Slider {...settings}>
          {addInfo.map((item) => (
            <div
              className={`"mr-1rem !important" "w-[18rem] !important"`}
              key={item.id}
            >
              <div>
                <Image
                  className=""
                  width={600}
                  height={255}
                  src={item.imgUrl}
                  alt={item.altText}
                  key={item.id}
                />{" "}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default AdSlider;
