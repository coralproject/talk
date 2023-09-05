import React, { FunctionComponent } from "react";

const AlarmBellIcon: FunctionComponent = () => {
  // https://www.streamlinehq.com/icons/streamline-regular/interface-essential/alert/alarm-bell
  return (
    <svg viewBox="-0.25 -0.25 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,21.75a2.087,2.087,0,0,0,4.005,0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 3L12 0.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12,3a7.5,7.5,0,0,1,7.5,7.5c0,7.046,1.5,8.25,1.5,8.25H3s1.5-1.916,1.5-8.25A7.5,7.5,0,0,1,12,3Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default AlarmBellIcon;
