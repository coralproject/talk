import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";

import styles from "./Username.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Username: FunctionComponent<Props> = props => {
  return (
    <Typography
      variant={"heading3"}
      className={cn(styles.root, props.className)}
      container="span"
    >
      {props.children}
    </Typography>
  );
};

export default Username;
