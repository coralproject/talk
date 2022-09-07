import React from "react";

import styles from "./MainLayout.css";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FunctionComponent<MainLayoutProps> = ({ children }) => (
  <div data-testid="main-layout">
    <div className={styles.bar} />
    <div className={styles.centered}>{children}</div>
  </div>
);

export default MainLayout;
