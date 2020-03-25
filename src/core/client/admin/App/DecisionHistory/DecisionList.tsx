import React, { FunctionComponent } from "react";

import styles from "./DecisionList.css";

const DecisionList: FunctionComponent = (props) => (
  <ul className={styles.root}>{props.children}</ul>
);

export default DecisionList;
