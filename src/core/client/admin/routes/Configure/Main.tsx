import React, { FunctionComponent } from "react";

import styles from "./Main.css";

const Main: FunctionComponent = ({ children }) => (
  <div className={styles.root}>{children}</div>
);

export default Main;
