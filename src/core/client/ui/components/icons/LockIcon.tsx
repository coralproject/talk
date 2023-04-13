import React, { FunctionComponent } from "react";

const LockIcon: FunctionComponent = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -0.25 24.5 24.5">
      <defs></defs>
      <title>lock-1</title>
      <rect
        x="3.75"
        y="9.75"
        width="16.5"
        height="13.5"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></rect>
      <path
        d="M6.75,9.75V6a5.25,5.25,0,0,1,10.5,0V9.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <line
        x1="12"
        y1="15"
        x2="12"
        y2="18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </svg>
  );
};

export default LockIcon;
