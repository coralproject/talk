import React, { FunctionComponent } from "react";

const AlertCircleIcon: FunctionComponent = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -0.25 24.5 24.5">
      <path
        stroke="currentColor"
        d="M12 17.25C11.7929 17.25 11.625 17.0821 11.625 16.875C11.625 16.6679 11.7929 16.5 12 16.5"
      ></path>
      <path
        stroke="currentColor"
        d="M12 17.25C12.2071 17.25 12.375 17.0821 12.375 16.875C12.375 16.6679 12.2071 16.5 12 16.5"
      ></path>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        d="M12 13.5V5.25"
      ></path>
      <path
        stroke="currentColor"
        strokeMiterlimit="10"
        d="M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z"
      ></path>
    </svg>
  );
};

export default AlertCircleIcon;
