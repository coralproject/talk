import React, { FunctionComponent } from "react";

import styles from "./UnorderedList.css";

interface UnorderedListProps {
  children?: React.ReactNode;
}

const UnorderedList: FunctionComponent<UnorderedListProps> = (props) => (
  <ul className={styles.root}>{props.children}</ul>
);

export default UnorderedList;
