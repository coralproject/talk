import React, { StatelessComponent } from "react";

import styles from "./SideBar.css";

const SideBar: StatelessComponent = ({ children }) => (
  <div className={styles.root}>{children}</div>
);

export default SideBar;
