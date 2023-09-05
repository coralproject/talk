import React, { FunctionComponent } from "react";

import styles from "./Main.css";

interface MainProps {
  children?: React.ReactNode;
}

const Main: FunctionComponent<MainProps> = ({ children }) => (
  <div className={styles.root}>{children}</div>
);

export default Main;
