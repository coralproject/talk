import React, { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

import styles from "./Subheader.css";

const Subheader: StatelessComponent = ({ children }) => (
  <Typography variant="heading3" className={styles.root}>
    {children}
  </Typography>
);

export default Subheader;
