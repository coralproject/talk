import React, { FunctionComponent } from "react";

import styles from "./UnorderedList.css";

const UnorderedList: FunctionComponent = (props) => (
  <ul className={styles.root}>{props.children}</ul>
);

export default UnorderedList;
