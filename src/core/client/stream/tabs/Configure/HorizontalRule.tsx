import React, { FunctionComponent } from "react";

import styles from "./HorizontalRule.css";

const HorizontalRule: FunctionComponent = ({ children }) => (
  <hr className={styles.root} />
);

export default HorizontalRule;
