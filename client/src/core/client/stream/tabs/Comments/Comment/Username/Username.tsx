import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Username.css";

interface Props {
  children: string | null;
  className?: string;
}

const Username: FunctionComponent<Props> = (props) => {
  return (
    <span className={cn(styles.root, props.className)}>{props.children}</span>
  );
};

export default Username;
