import cn from "classnames";
import React, { StatelessComponent } from "react";

import styles from "./Line.css";

interface CircleProps {
  active?: boolean;
  completed?: boolean;
}

const Line: StatelessComponent<CircleProps> = ({ active, completed }) => {
  const rootClassName = cn(styles.root, {
    [styles.completed]: completed,
  });
  return <span className={rootClassName} />;
};

export default Line;
