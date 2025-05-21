"use client";

import Image from "next/image";
import { useAppDispatch } from "./store";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BiTargetLock } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
import CardList from "./components/home/Cardlist";
import Partner from "./components/home/Partner";

export default function Home() {
  const router = useRouter();
  // const locationNameRef = useRef<any>(null);
  // const { isLoggedIn, userInfo } = useAppSelector((state) => state.userinfo);
  // const { city, road, area } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  // const [isLoading, userData, userError] = useIsLoggedIn();
  const [isMapModal, setMapModal] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  // const Map = useMemo();
  // () =>
  //   dynamic(() => import("./component/Map"), {
  //     ssr: false,
  //   }),
  // [location]

  const urlSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  // const [inputValue, setInputValue] = useState<any>("");

  const [inputValue, setInputValue] = useState("");
  const [isLocation, setIsLocation] = useState(false);

  const handleInputChange = () => {};

  const handleSelectOption = () => {};

  const mapModalhandler = () => {};

  const setDeliveryUrlHandler = () => {
    router.push("/dashboard");
  };

  const setMapUrlHandler = () => {};

  const closeModal = () => {
    router.push("/login");
  };

  // const [modalRef] = useOptionClose({ closeModal });

  const setPickUpUrlHandler = () => {};

  // let mapInputValue = area + "," + road + "," + city;

  const handleFocus = () => {
    // Perform the action you want when the input is focused
  };

  const handleBlur = () => {};

  let content;
  if (false) {
    content = <p>Loading</p>;
  } else if (true && true) {
    content = (
      <main>
        <div className="flex items-center relative z-50  h-[60vh] md:h-[80vh]  md:-mt-[6rem]  lg:h-[100vh] lg:-mt-[2rem] ">
          <div className="w-5/5  md:w-4/5  md:-mt-48">
            <h1 className="relative pl-10 md:pl-[3rem] w-4/4  font-bold text-4xl">
              Interactive learning for everyone.
            </h1>
            <span className=" w-11/12    lg:w-4/5  left-[50%] lg:left-[43%] -translate-x-[50%] lg: mt-[6rem] absolute md:inline-flex md:gap-4 md:pt-3 md:pl-4 md:px-5 md:shadow-lg ">
              {/* <input
                // @ts-ignore
                autoComplete="off"
                className="w-full  md:w-3/6   h-16 rounded-md shadow-lg md:shadow-none pl-3 mb-5 outline-gray-300 outline-1"
                type="text"
                id="searchbox"
                value={inputValue}
                // onChange={(e) => setInputValue(e.target.value)}
                onChange={handleInputChange}
                placeholder="Enter your full address"
              />
              <BiTargetLock
                onClick={mapModalhandler}
                size={25}
                className="text-amber-500 absolute top-5 right-6 md:right-[60vw] md:top-8 lg:right-[43vw] cursor-pointer"
              />

              {
                <div
                  className={`absolute  text-gray-600 -top-8 left-1 md:left-2 lg:left-5 px-1 py-1 w-2/3  ${
                    isLocation
                      ? "transition-opacity duration-500 animate-bounce "
                      : "transition-opacity duration-500 opacity-0"
                  }`}
                >
                  <h3 className="text-lg lg:text-2xl  text-pandaColor-primary">
                    Please enter a location
                  </h3>
                </div>
              } */}
              {/* {inputValue && (
                <ul className=" absolute top-0 left-1 lg:left-3 w-2/3 lg:w-1/3 bg-white mt-[4.1rem] md:mt-[4.8rem]  lg:mt-20 z-[500]">
                  {location
                    .filter(
                      (option) =>
                        option
                          .toLowerCase()
                          .includes(inputValue.toLowerCase()) &&
                        option !== selectedOption
                    )
                    .map((option, index) => (
                      <li
                        key={index}
                        className="px-3 text-lg py-1 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelectOption(option)}
                      >
                        {option}
                      </li>
                    ))}
                </ul>
              )} */}

              <div className="flex items-center  gap-3">
                <button
                  onClick={setDeliveryUrlHandler}
                  className="bg-amber-500 hover:bg-amber-300 hover:scale-105 w-1/2 md:w-[11rem] py-5 md:mb-4 rounded-lg font-medium text-white"
                >
                  Dashboard
                </button>
                <p className="text-lg font-light md:mb-4">or</p>
                <button
                  onClick={closeModal}
                  className="bg-amber-300 hover:bg-amber-400 hover:scale-105  w-1/2 md:w-[11rem] py-5 md:mb-4 rounded-lg font-medium text-white"
                >
                  Login
                </button>
              </div>
            </span>
            {isMapModal && (
              <div
                ref={modalRef}
                className="shadow-[0px_0px_8px_3px_rgba(0,0,0,0.2)] rounded-xl bg-white w-3/4 md:2/4 right-1/2 translate-x-1/2 top-[6rem] absolute p-5 "
              >
                <h2 className="text-lg text-pandaColor-primary font-medium mt-1 mb-4">
                  Search your Location
                </h2>
                <button
                  className="absolute right-5 top-6 px-[.7rem] py-1 text-pandaColor-primary font-bold bg-white rounded-3xl"
                  onClick={closeModal}
                >
                  Login
                </button>

                <div className="mb-2">{/* <Map /> */}</div>
                {area && (
                  <div className="bg-red-100 text-black font-medium py-2 px-1">
                    <p>
                      {area} , {road}
                    </p>
                    <p> {city}</p>
                    <p></p>
                  </div>
                )}

                <button
                  onClick={() => setMapUrlHandler(area)}
                  className="bg-pandaColor-primary hover:bg-pandaColor-light  w-full  py-3 my-2 rounded-lg font-medium text-white"
                >
                  Search Organization
                </button>
              </div>
            )}
          </div>
          <div className="h-[90%]">
            <Image
              src="/images/gallery-1.webp"
              width={1200}
              height={1200}
              alt="picture of groceries"
              className="h-full w-full object-fill"
            />
          </div>
        </div>

        <Partner />

        {/* <span className="bg-slate-400 h-[10rem]"> */}
        <CardList />
        {/* </span> */}
      </main>
    );
  } else {
    content = <p>userError</p>;
  }

  return content;
}
