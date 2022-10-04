import React, { FunctionComponent } from "react";

import styles from "./SideBar.css";

const SideBar: FunctionComponent = ({ children }) => (
  <div className={styles.root}>{children}</div>
);

export default SideBar;
