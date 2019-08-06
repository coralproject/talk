import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Typography } from "coral-ui/components";

import styles from "./Username.css";

interface Props {
  children: React.ReactNode;
}

const Username: FunctionComponent<Props> = props => {
  return (
    <Typography
      variant={"heading3"}
      className={cn(styles.root, CLASSES.comment.username)}
      container="span"
    >
      {props.children}
    </Typography>
  );
};

export default Username;
