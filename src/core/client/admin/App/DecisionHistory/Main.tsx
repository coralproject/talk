import React, { FunctionComponent } from "react";

import styles from "./Main.css";

interface MainProps {
  children?: React.ReactNode;
}

const Main: FunctionComponent<MainProps> = (props) => (
  <div className={styles.root}>{props.children}</div>
);

export default Main;
