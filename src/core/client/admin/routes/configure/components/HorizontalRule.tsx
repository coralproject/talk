import React, { StatelessComponent } from "react";

import styles from "./HorizontalRule.css";

const HorizontalRule: StatelessComponent = ({ children }) => (
  <hr className={styles.root} />
);

export default HorizontalRule;
