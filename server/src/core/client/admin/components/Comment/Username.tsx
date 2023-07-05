import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Username.css";

export interface UsernameProps {
  className?: string;
  children: string;
}

const Username: FunctionComponent<UsernameProps> = (props) => {
  return (
    <span className={cn(props.className, styles.root)}>{props.children}</span>
  );
};

export default Username;
