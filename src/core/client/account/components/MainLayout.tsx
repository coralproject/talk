import React from "react";

import styles from "./MainLayout.css";

const MainLayout: React.FunctionComponent = ({ children }) => (
  <div data-testid="main-layout">
    <div className={styles.bar} />
    <div className={styles.centered}>{children}</div>
  </div>
);

export default MainLayout;
