import React, { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import styles from "./Info.css";

interface Props {
  children: React.ReactNode;
}

const Info: StatelessComponent<Props> = props => (
  <Typography className={styles.root}>{props.children}</Typography>
);

export default Info;
