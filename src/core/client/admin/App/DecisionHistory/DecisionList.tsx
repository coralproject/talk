import React, { FunctionComponent } from "react";

import styles from "./DecisionList.css";

interface DecisionListProps {
  children?: React.ReactNode;
}

const DecisionList: FunctionComponent<DecisionListProps> = (props) => (
  <ul className={styles.root}>{props.children}</ul>
);

export default DecisionList;
