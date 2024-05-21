import React, { FunctionComponent } from "react";

const SignBadgeCircleDuoIcon: FunctionComponent = () => {
  // https://www.streamlinehq.com/icons/streamline-duotone/maps-navigation/sign-shapes/sign-badge-circle
  // filled property provides color for left side of circle
  // color property provides color for outline and right side of circle
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 24 24">
      <path d="M1.9166666666666667 11.565166666666666a9.583333333333334 9.583333333333334 0 1 0 19.166666666666668 0 9.583333333333334 9.583333333333334 0 1 0 -19.166666666666668 0"></path>
      <path
        fill="currentColor"
        d="M11.5 21.148500000000002a9.583333333333334 9.583333333333334 0 0 1 0 -19.166666666666668Z"
      ></path>
      <path
        d="M1.9166666666666667 11.565166666666666a9.583333333333334 9.583333333333334 0 1 0 19.166666666666668 0 9.583333333333334 9.583333333333334 0 1 0 -19.166666666666668 0"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="currentColor"
      ></path>
    </svg>
  );
};

export default SignBadgeCircleDuoIcon;
