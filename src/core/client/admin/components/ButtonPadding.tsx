import React, { FunctionComponent } from "react";

import styles from "./ButtonPadding.css";

const ButtonPadding: FunctionComponent = props => (
  <div className={styles.root}>{props.children}</div>
);

export default ButtonPadding;
