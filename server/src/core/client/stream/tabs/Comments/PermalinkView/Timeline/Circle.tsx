import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Circle.css";

export interface CircleProps {
  className?: string;
  hollow?: boolean;
  end?: boolean;
  children?: React.ReactNode;
}

const Circle: FunctionComponent<CircleProps> = (props) => {
  return (
    <div className={cn(styles.circleContainer, props.className)}>
      <div
        className={cn(styles.circleSubContainer, { [styles.end]: props.end })}
      >
        <svg
          className={styles.circle}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {props.hollow && (
            <circle cx="50" cy="50" r="40" strokeWidth="8" fill="none" />
          )}
          {!props.hollow && <circle cx="50" cy="50" r="50" />}
        </svg>
      </div>
      {props.children}
    </div>
  );
};

export default Circle;
