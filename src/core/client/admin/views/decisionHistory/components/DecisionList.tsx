import React, { StatelessComponent } from "react";

import styles from "./DecisionList.css";

const DecisionList: StatelessComponent = props => (
  <ul className={styles.root}>{props.children}</ul>
);

export default DecisionList;
