import React, { FunctionComponent } from "react";

import styles from "./Info.css";

interface Props {
  children: React.ReactNode;
}

const Info: FunctionComponent<Props> = (props) => (
  <span className={styles.root}>{props.children}</span>
);

export default Info;
