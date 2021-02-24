import React, { FunctionComponent } from "react";

interface Props {
  width: string;
  height: string;
  className?: string;
  fill?: string;
}

const ShortcutIcon: FunctionComponent<Props> = ({
  width,
  height,
  className,
  fill,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={width}
      height={height}
      className={className}
    >
      <g>
        <path d="M0,0h24v24H0V0z" fill="none" />
      </g>
      <g>
        <path d="M21,11l-6-6v5H8c-2.76,0-5,2.24-5,5v4h2v-4c0-1.65,1.35-3,3-3h7v5L21,11z" />
      </g>
    </svg>
  );
};

export default ShortcutIcon;
