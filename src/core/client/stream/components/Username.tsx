import React from "react";
import { StatelessComponent } from "react";

import * as styles from "./Username.css";

export interface CommentProps {
  children: string;
}

const Username: StatelessComponent<CommentProps> = props => {
  return <span className={styles.root}>{props.children}</span>;
};

export default Username;
