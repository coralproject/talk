import React, { FunctionComponent } from "react";

import styles from "./Navigation.css";

const Navigation: FunctionComponent = ({ children }) => (
  <nav className={styles.root}>
    <ul className={styles.ul}>{children}</ul>
  </nav>
);

export default Navigation;
