import * as React from "react";
import { StatelessComponent } from "react";

import styles from "./Line.css";

const Circle: StatelessComponent = props => {
  return <div className={styles.root}>{props.children}</div>;
};

export default Circle;
