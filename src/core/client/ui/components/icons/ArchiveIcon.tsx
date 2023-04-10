import React, { FunctionComponent } from "react";

const ArchiveIcon: FunctionComponent = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -0.25 24.5 24.5">
      <g>
        <path
          d="M21.75,9.75v9.5a3,3,0,0,1-3,3H5.25a3,3,0,0,1-3-3V9.75"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.75,1.75H2.25a1.5,1.5,0,0,0-1.5,1.5v3h22.5v-3A1.5,1.5,0,0,0,21.75,1.75Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <rect
          x="8.5"
          y="10.25"
          width="7"
          height="4"
          rx="1.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></rect>
      </g>
    </svg>
  );
};

export default ArchiveIcon;
