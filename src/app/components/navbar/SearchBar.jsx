import Link from "next/link";
import React from "react";

const SearchBar = () => {
  return (
    <div className="text-2xl font-bold">
      {" "}
      <Link
        href="/dashboard"
        className="hover:font-bold text-black font-bold py-2 px-4 "
      >
        <span className="text-transparent font-bold text-2xl bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          UniHive
        </span>
      </Link>{" "}
    </div>
  );
};

export default SearchBar;
