import React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";
import styles from "./Subtitle.css";

interface Props {
  children?: React.ReactNode;
}

const Subtitle: StatelessComponent<Props> = props => (
  <Typography variant="heading4" align="center" className={styles.root}>
    {props.children}
  </Typography>
);

export default Subtitle;
