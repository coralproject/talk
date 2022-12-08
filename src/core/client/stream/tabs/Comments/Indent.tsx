import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";

import styles from "./Indent.css";

export interface IndentProps {
  className?: string;
  classNameIndent?: string;
  level?: number;
  noBorder?: boolean;
  children: React.ReactNode;
  collapsed?: boolean;
}

const levels = [
  "",
  styles.level1,
  styles.level2,
  styles.level3,
  styles.level4,
  styles.level5,
  styles.level6,
  styles.level7,
  styles.level8,
];

function getLevelClassName(level = 0) {
  if (!(level in levels)) {
    throw new Error(`Indent level ${level} does not exist`);
  }
  return cn(levels[level], CLASSES.comment.indent(level));
}

const Indent: FunctionComponent<IndentProps> = (props) => {
  return (
    <div className={cn(props.className, styles.root)}>
      <div
        className={cn(props.classNameIndent, getLevelClassName(props.level), {
          [styles.noBorder]: props.noBorder,
          [styles.collapsed]: props.collapsed,
          [styles.open]: !props.collapsed,
          [styles.openPadded]:
            !props.collapsed && props.level ? props.level > 0 : false,
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Indent;
