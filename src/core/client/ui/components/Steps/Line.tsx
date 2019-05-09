import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Line.css";

interface CircleProps {
  active?: boolean;
  completed?: boolean;
}

const Line: FunctionComponent<CircleProps> = ({ active, completed }) => {
  const rootClassName = cn(styles.root, {
    [styles.completed]: completed,
  });
  return <span className={rootClassName} />;
};

export default Line;
