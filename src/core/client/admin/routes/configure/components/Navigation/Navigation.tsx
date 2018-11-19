import React, { StatelessComponent } from "react";

import styles from "./Navigation.css";

const Navigation: StatelessComponent = ({ children }) => (
  <nav className={styles.root}>
    <ul className={styles.ul}>{children}</ul>
  </nav>
);

export default Navigation;
