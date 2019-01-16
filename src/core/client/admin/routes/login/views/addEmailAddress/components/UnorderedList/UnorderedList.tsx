import React from "react";
import { StatelessComponent } from "react";

import styles from "./UnorderedList.css";

const UnorderedList: StatelessComponent = props => (
  <ul className={styles.root}>{props.children}</ul>
);

export default UnorderedList;
