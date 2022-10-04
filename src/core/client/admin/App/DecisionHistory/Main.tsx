import React, { FunctionComponent } from "react";

import styles from "./Main.css";

const Main: FunctionComponent = (props) => (
  <div className={styles.root}>{props.children}</div>
);

export default Main;
