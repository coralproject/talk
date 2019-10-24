import React, { FunctionComponent } from "react";

import styles from "./Subheader.css";

const Subheader: FunctionComponent = ({ children }) => (
  <h3 className={styles.root}>{children}</h3>
);

export default Subheader;
