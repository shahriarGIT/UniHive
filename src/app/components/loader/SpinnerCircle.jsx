import React from "react";
import { Oval } from "react-loader-spinner";

const SpinnerCircle = () => {
  return (
    <div className="grid place-items-center">
      <Oval
        height={20}
        width={20}
        color="#ff2b85"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#facdee"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default SpinnerCircle;
