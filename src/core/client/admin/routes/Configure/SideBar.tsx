import React, { FunctionComponent } from "react";

import styles from "./SideBar.css";

interface SideBarProps {
  children?: React.ReactNode;
}

const SideBar: FunctionComponent<SideBarProps> = ({ children }) => (
  <div className={styles.root}>{children}</div>
);

export default SideBar;
