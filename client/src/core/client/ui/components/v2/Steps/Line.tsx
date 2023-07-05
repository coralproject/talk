import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Line.css";

interface LineProps {
  completed?: boolean;
  className?: string;
}

const Line: FunctionComponent<LineProps> = ({ completed, className }) => {
  const rootClassName = cn(
    styles.root,
    {
      [styles.completed]: completed,
    },
    className
  );
  return <span className={rootClassName} />;
};

export default Line;
