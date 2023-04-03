import React, { FunctionComponent } from "react";

const StrikethroughIcon: FunctionComponent = () => {
  return (
    <svg viewBox="-0.25 -0.25 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.75.748H11.727c-2.485,0-4.977,2.014-4.977,4.5,0,6.75,12,6.75,12,13.5a4.5,4.5,0,0,1-4.5,4.5H6.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M0.75 12.748L23.25 12.748"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default StrikethroughIcon;
