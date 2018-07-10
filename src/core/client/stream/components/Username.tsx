import React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import * as styles from "./Username.css";

export interface CommentProps {
  children: string;
}

const Username: StatelessComponent<CommentProps> = props => {
  return (
    <Typography className={styles.root} gutterBottom>
      {props.children}
    </Typography>
  );
};

export default Username;
