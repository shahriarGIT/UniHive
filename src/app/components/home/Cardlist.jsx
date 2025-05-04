"use client";

import React from "react";
import Card from "./Card";

const cardInfo = [
  {
    id: 1,
    city: "	Aston University",
    alphabet: "A",
    img: "/images/category/3d.png",
  },
  {
    id: 2,
    city: "	BPP University",
    alphabet: "B",
    img: "/images/cities/city-title-Chittagong.webp",
  },
  {
    id: 3,
    city: "	Cardiff University",
    alphabet: "C",
    img: "/images/cities/city-tile-Bogra.webp",
  },
  {
    id: 4,
    city: "Open University",
    alphabet: "O",
    img: "/images/cities/city-title-Sylhet.webp",
  },
  {
    id: 5,
    city: "University of Oxford",
    alphabet: "O",
    img: "/images/cities/city-title-Bhola.webp",
  },
  {
    id: 6,
    city: "University of Suffolk",
    alphabet: "S",
    img: "/images/cities/city-title-Keraniganj.webp",
  },
  {
    id: 7,
    city: "Swansea University",
    alphabet: "S",
    img: "/images/cities/city-title-Kushtia.jpg",
  },
  {
    id: 8,
    city: "University of Law",
    alphabet: "L",
    img: "/images/cities/city-title-Mymensingh.webp",
  },
  {
    id: 9,
    city: "University of York",
    alphabet: "Y",
    img: "/images/cities/city-title-Noakhali.webp",
  },
  {
    id: 10,
    city: "Ulster University",
    alphabet: "U",
    img: "/images/cities/city-title-Sirajganj.webp",
  },
];

const CardList = () => {
  return (
    <div className="mt-[3rem] md:mt-[2rem] p-4 lg:px-20">
      <div className="pl-3 md:pl-24  relative">
        <h2 className="font-extrabold mt-[2.5rem] md:mt-0 text-7xl md:text-9xl text-neutral-300 opacity-70 absolute">
          Organizations
        </h2>
        <h4 className="text-black text-base  translate-y-20 md:text-3xl z-10 relative">
          "Together, we're shaping the future of education"
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
