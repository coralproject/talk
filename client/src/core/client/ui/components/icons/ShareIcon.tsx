import React, { FunctionComponent } from "react";

const ShareIcon: FunctionComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="13"
      viewBox="0 0 15 13"
    >
      <circle cx="3.08972" cy="6.58496" r="2.2113" fill="currentColor" />
      <circle cx="12.4056" cy="2.45667" r="2.2113" fill="currentColor" />
      <circle cx="12.4056" cy="10.7133" r="2.2113" fill="currentColor" />
      <line
        y1="-0.5"
        x2="9.6707"
        y2="-0.5"
        transform="matrix(0.92152 -0.388331 0.459597 0.888127 3.49414 6.58496)"
        stroke="currentColor"
      />
      <line
        y1="-0.5"
        x2="9.6707"
        y2="-0.5"
        transform="matrix(0.92152 0.388331 0.459597 -0.888127 3.49414 6.58496)"
        stroke="currentColor"
      />
    </svg>
  );
};

export default ShareIcon;
