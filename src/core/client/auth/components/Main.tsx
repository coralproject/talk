import React from "react";
import { StatelessComponent } from "react";

import styles from "./Main.css";

export interface MainProps {
  children: React.ReactNode;
}

const Main: StatelessComponent<MainProps> = props => (
  <div className={styles.root}>{props.children}</div>
);

export default Main;
