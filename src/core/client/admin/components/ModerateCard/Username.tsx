import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";

import styles from "./Username.css";

export interface UsernameProps {
  className?: string;
  children: string;
}

const Username: FunctionComponent<UsernameProps> = props => {
  return (
    <Typography
      variant="header4V2"
      className={cn(props.className, styles.root)}
      container="span"
    >
      {props.children}
    </Typography>
  );
};

export default Username;
