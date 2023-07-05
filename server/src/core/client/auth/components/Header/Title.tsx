import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components/v2";

import styles from "./Title.css";

interface Props {
  children?: React.ReactNode;
}

const Title: FunctionComponent<Props> = (props) => (
  <Typography variant="heading2" align="center" className={styles.root}>
    {props.children}
  </Typography>
);

export default Title;
