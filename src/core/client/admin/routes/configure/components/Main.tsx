import React, { StatelessComponent } from "react";

import styles from "./Main.css";

const Main: StatelessComponent = ({ children }) => (
  <div className={styles.root}>{children}</div>
);

export default Main;
