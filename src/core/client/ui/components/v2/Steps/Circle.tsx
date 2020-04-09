import cn from "classnames";
import React, { FunctionComponent } from "react";

import Icon from "../Icon";

import styles from "./Circle.css";

interface CircleProps {
  active?: boolean;
  completed?: boolean;
}

const Circle: FunctionComponent<CircleProps> = ({ active, completed }) => {
  const rootClassName = cn(styles.root, {
    [styles.active]: active,
    [styles.completed]: completed,
  });
  return (
    <span className={rootClassName}>
      {completed && <Icon className={styles.icon}>done</Icon>}
    </span>
  );
};

export default Circle;
