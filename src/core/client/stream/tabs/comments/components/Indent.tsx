import cn from "classnames";
import React, { StatelessComponent } from "react";

import * as styles from "./Indent.css";

export interface IndentProps {
  className?: string;
  level?: number;
  noBorder?: boolean;
  children: React.ReactNode;
}

const Indent: StatelessComponent<IndentProps> = props => {
  return (
    <div className={cn(props.className, styles.root)}>
      <div
        className={cn({
          [styles.level1]: props.level === 1,
          [styles.level2]: props.level === 2,
          [styles.level3]: props.level === 3,
          [styles.level4]: props.level === 4,
          [styles.level5]: props.level === 5,
          [styles.level6]: props.level === 6,
          [styles.noBorder]: props.noBorder,
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Indent;
