import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Circle.css";

export interface CircleProps {
  className?: string;
  hollow?: boolean;
  size?: "small" | "regular";
  color?: "light" | "regular";
}

const Circle: FunctionComponent<CircleProps> = (props) => {
  return (
    <div
      className={cn(styles.root, props.className, {
        [styles.sizeReg]: props.size === "regular",
        [styles.sizeSmall]: props.size === "small",
        [styles.colorReg]: props.color === "regular",
        [styles.colorLight]: props.color === "light",
      })}
    >
      <svg
        className={cn(styles.circle, {})}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {props.hollow && (
          <circle cx="50%" cy="50%" r="45" strokeWidth="10" fill="none" />
        )}
        {!props.hollow && <circle cx="50%" cy="50%" r="50" />}
      </svg>
    </div>
  );
};

Circle.defaultProps = {
  size: "regular",
  color: "regular",
};

export default Circle;
