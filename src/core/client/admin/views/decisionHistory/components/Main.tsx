import React, { StatelessComponent } from "react";

import styles from "./Main.css";

const Main: StatelessComponent = props => (
  <div className={styles.root}>{props.children}</div>
);

export default Main;
