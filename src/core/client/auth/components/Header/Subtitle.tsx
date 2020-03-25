import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";

import styles from "./Subtitle.css";

interface Props {
  children?: React.ReactNode;
}

const Subtitle: FunctionComponent<Props> = (props) => (
  <Typography variant="heading4" align="center" className={styles.root}>
    {props.children}
  </Typography>
);

export default Subtitle;
