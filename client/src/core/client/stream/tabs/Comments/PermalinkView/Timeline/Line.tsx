import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Line.css";

interface LineProps {
  className?: string;
  dotted?: boolean;
  children?: React.ReactNode;
}

const Line: FunctionComponent<LineProps> = (props) => {
  return (
    <div
      className={cn(styles.root, props.className, {
        [styles.dotted]: props.dotted,
      })}
    >
      {props.children}
    </div>
  );
};

export default Line;
