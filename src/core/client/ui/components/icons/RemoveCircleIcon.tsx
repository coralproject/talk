import React, { FunctionComponent } from "react";

const RemoveCircleIcon: FunctionComponent = () => {
  // https://www.streamlinehq.com/icons/streamline-regular/interface-essential/remove-add/remove-circle
  return (
    <svg viewBox="-0.25 -0.25 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.182 8.818L8.818 15.181"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M8.818 8.818L15.182 15.181"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M0.750 12.000 A11.250 11.250 0 1 0 23.250 12.000 A11.250 11.250 0 1 0 0.750 12.000 Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default RemoveCircleIcon;
