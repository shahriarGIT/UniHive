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
        UniHive
      </Link>{" "}
    </div>
  );
};

export default SearchBar;
