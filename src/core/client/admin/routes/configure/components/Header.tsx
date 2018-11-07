import React, { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

import styles from "./Header.css";

const Configure: StatelessComponent = ({ children }) => (
  <Typography variant="heading1" className={styles.root}>
    {children}
  </Typography>
);

export default Configure;
