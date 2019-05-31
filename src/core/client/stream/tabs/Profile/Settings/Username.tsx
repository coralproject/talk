import React, { FunctionComponent } from "react";

import styles from "./Username.css";

const Username: FunctionComponent = ({ children }) => (
  <span className={styles.root}>{children}</span>
);

export default Username;
