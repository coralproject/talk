import cn from "classnames";
import React, { StatelessComponent } from "react";

import * as styles from "./Counter.css";

interface Props {
  className?: string;
}

const Counter: StatelessComponent<Props> = props => {
  return (
    <span className={cn(styles.root, props.className)}>{props.children}</span>
  );
};

export default Counter;
