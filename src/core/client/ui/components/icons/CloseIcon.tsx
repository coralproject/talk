import React, { FunctionComponent } from "react";

const CloseIcon: FunctionComponent = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Close</title>
      <path
        d="M0.75 23.249L23.25 0.749"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M23.25 23.249L0.75 0.749"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default CloseIcon;
