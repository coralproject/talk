import cn from "classnames";
import React, { StatelessComponent } from "react";
import Icon from "../Icon";

import styles from "./Circle.css";

interface CircleProps {
  active?: boolean;
  completed?: boolean;
}

const Circle: StatelessComponent<CircleProps> = ({ active, completed }) => {
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
