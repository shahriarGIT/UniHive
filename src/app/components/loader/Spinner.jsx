import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Spinner = ({ position, height }) => {
  const containerStyle = {
    position: position || "relative",
    height: height || "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const spinnerWrapperStyle = {
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      <ThreeDots
        height={50}
        width={50}
        radius="9"
        color="#ff2b85"
        ariaLabel="three-dots-loading"
        wrapperStyle={spinnerWrapperStyle}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Spinner;
