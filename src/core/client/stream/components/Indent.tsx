import cn from "classnames";
import React, { StatelessComponent } from "react";

import * as styles from "./Indent.css";

export interface IndentProps {
  level?: number;
  children: React.ReactNode;
}

const Indent: StatelessComponent<IndentProps> = props => {
  return <div className={cn(styles.root, styles.level0)}>{props.children}</div>;
};

export default Indent;
