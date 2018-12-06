import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import styles from "./Username.css";

export interface UsernameProps {
  className?: string;
  children: string;
}

const Username: StatelessComponent<UsernameProps> = props => {
  return (
    <Typography
      variant="heading2"
      className={cn(props.className, styles.root)}
      container="span"
    >
      {props.children}
    </Typography>
  );
};

export default Username;
