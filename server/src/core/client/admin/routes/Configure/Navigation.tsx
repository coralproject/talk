import React, { FunctionComponent } from "react";

import styles from "./Navigation.css";

interface NavigationProps {
  children?: React.ReactNode;
}

const Navigation: FunctionComponent<NavigationProps> = ({ children }) => (
  <nav className={styles.root}>
    <ul className={styles.ul}>{children}</ul>
  </nav>
);

export default Navigation;
