import React from "react";
import { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";

import styles from "./Username.css";

interface Props {
  children: React.ReactNode;
}

const Username: FunctionComponent<Props> = props => {
  return (
    <Typography variant={"heading3"} className={styles.root} container="span">
      {props.children}
    </Typography>
  );
};

export default Username;
