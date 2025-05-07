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
          Together, we're shaping the future of education"
        </h4>
      </div>
      {/* className="bg-[url('/images/home-vendor-bd.webp')] */}
      <div className="h-[25rem] relative ">
        <Image
          src="/images/category/learn.jpg"
          width={2000}
          height={1400}
          alt="image of chef cooking"
          className="h-full w-full object-cover bg-top"
        />
      </div>
      <div className="relative mx-auto md:ml-24 -mt-28 bg-slate-50 w-11/12 md:w-3/5 lg:w-2/5 p-10">
        <h2 className="text-2xl text-gray-800">Enjoy Learning </h2>
        <h3 className="text-lg text-gray-600 pt-8">
          Learn together, learn better! Our app empowers you to create and share
          quizzes, polls, and flashcards with your community. Experience the
          power of real-time collaboration as you test your knowledge, gather
          feedback, and master new skills together.
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
