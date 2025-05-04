"use client";
import React, { useEffect, useState } from "react";

const AlertMessage = ({
  info = true,
  error = false,
  success = false,
  errorType = "Error",
  message = "Something Went Wrong!!",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the component after 3000 milliseconds (3 seconds)
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 4000);

    // Clear the timeout if the component is unmounted before the timeout finishes
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) {
    return null; // If not visible, render nothing (null)
  }

  let style = "";
  if (info) style = "text-yellow-400 border-yellow-500";
  if (error) style = "text-red-600 border-red-500";
  if (success) style = "text-green-500 border-green-500 ";
  return (
    <div
      className={`border-2 rounded-md shadow-[0px_0px_5px_2px_rgba(0,0,0,0.2)] text-lg w-full my-2 ${style}   `}
    >
      <h2 className=" px-4 py-2">
        <span className="font-medium">{errorType}:</span>{" "}
        <span className="text-base text-black">{message}</span>
      </h2>
    </div>
  );
};

export default AlertMessage;
