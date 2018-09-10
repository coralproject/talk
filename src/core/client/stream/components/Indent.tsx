import cn from "classnames";
import React, { StatelessComponent } from "react";

import * as styles from "./Indent.css";

export interface IndentProps {
  level?: number;
  noBorder?: boolean;
  children: React.ReactNode;
}

const Indent: StatelessComponent<IndentProps> = props => {
  return (
    <div
      className={cn(styles.root, {
        [styles.level1]: props.level === 1,
        [styles.noBorder]: props.noBorder,
      })}
    >
      {props.children}
    </div>
  );
};

export default Indent;
