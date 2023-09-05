import cn from "classnames";
import React, { FunctionComponent } from "react";

import { CheckIcon, SvgIcon } from "coral-ui/components/icons";

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
      {completed && (
        <SvgIcon className={styles.icon} size="xs" Icon={CheckIcon} />
      )}
    </span>
  );
};

export default Circle;
