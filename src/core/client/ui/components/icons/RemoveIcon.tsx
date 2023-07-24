import React, { FunctionComponent } from "react";

const RemoveIcon: FunctionComponent = () => {
  // https://www.streamlinehq.com/icons/streamline-regular/interface-essential/remove-add/remove
  return (
    <svg viewBox="-0.25 -0.25 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.5 19.5L19.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4.5 4.5L19.5 19.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default RemoveIcon;
