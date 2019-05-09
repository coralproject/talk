import React, { FunctionComponent } from "react";
import { Typography } from "talk-ui/components";

import styles from "./Subheader.css";

const Subheader: FunctionComponent = ({ children }) => (
  <Typography variant="heading3" className={styles.root}>
    {children}
  </Typography>
);

export default Subheader;
