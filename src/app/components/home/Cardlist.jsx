"use client";

import React from "react";
import Card from "./Card";

const cardInfo = [
  {
    id: 1,
    city: "Dhaka",
    alphabet: "D",
    img: "/images/cities/city-title-Dhaka.webp",
  },
  {
    id: 2,
    city: "Chittagong",
    alphabet: "C",
    img: "/images/cities/city-title-Chittagong.webp",
  },
  {
    id: 3,
    city: "Bogra",
    alphabet: "B",
    img: "/images/cities/city-tile-Bogra.webp",
  },
  {
    id: 4,
    city: "Sylhet",
    alphabet: "S",
    img: "/images/cities/city-title-Sylhet.webp",
  },
  {
    id: 5,
    city: "Bhola",
    alphabet: "B",
    img: "/images/cities/city-title-Bhola.webp",
  },
  {
    id: 6,
    city: "Keraniganj",
    alphabet: "K",
    img: "/images/cities/city-title-Keraniganj.webp",
  },
  {
    id: 7,
    city: "Kushtia",
    alphabet: "K",
    img: "/images/cities/city-title-Kushtia.jpg",
  },
  {
    id: 8,
    city: "Mymensingh",
    alphabet: "M",
    img: "/images/cities/city-title-Mymensingh.webp",
  },
  {
    id: 9,
    city: "Noakhali",
    alphabet: "N",
    img: "/images/cities/city-title-Noakhali.webp",
  },
  {
    id: 10,
    city: "Sirajganj",
    alphabet: "S",
    img: "/images/cities/city-title-Sirajganj.webp",
  },
];

const CardList = () => {
  return (
    <div className="mt-[3rem] md:mt-[2rem] p-4 lg:px-20">
      <div className="pl-3 md:pl-24  relative">
        <h2 className="font-extrabold mt-[2.5rem] md:mt-0 text-7xl md:text-9xl text-neutral-300 opacity-70 absolute">
          Cities
        </h2>
        <h4 className="text-black text-base  translate-y-20 md:text-3xl z-10 relative">
          Find us in these cities and many more!
        </h4>
      </div>
      <div className="flex  gap-12 overflow-x-auto overflow-y-hidden  lg:gap-12  lg:justify-center lg:flex-wrap mt-20 ">
        {cardInfo.map((item) => (
          <Card
            key={item.id}
            city={item.city}
            alphabet={item.alphabet}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
};

export default CardList;
