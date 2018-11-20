import cn from "classnames";
import React, { StatelessComponent } from "react";

import styles from "./Indent.css";

export interface IndentProps {
  className?: string;
  level?: number;
  noBorder?: boolean;
  children: React.ReactNode;
}

const levels = [
  "",
  styles.level1,
  styles.level2,
  styles.level3,
  styles.level4,
  styles.level5,
  styles.level6,
];

function getLevelClassName(level: number = 0) {
  if (!(level in levels)) {
    throw new Error(`Indent level ${level} does not exist`);
  }
  return levels[level];
}

const Indent: StatelessComponent<IndentProps> = props => {
  return (
    <div className={cn(props.className, styles.root)}>
      <div
        className={cn(getLevelClassName(props.level), {
          [styles.noBorder]: props.noBorder,
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Indent;
