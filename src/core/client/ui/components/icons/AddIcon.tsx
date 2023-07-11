import React, { FunctionComponent } from "react";

const AddIcon: FunctionComponent = () => {
  // https://www.streamlinehq.com/icons/streamline-regular/interface-essential/remove-add/add
  return (
    <svg viewBox="-0.25 -0.25 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.75 12L23.25 12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 0.75L12 23.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default AddIcon;
