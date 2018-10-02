import cn from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";

import styles from "./Line.css";

interface LineProps {
  className?: string;
  dashed?: boolean;
}

const Line: StatelessComponent<LineProps> = props => {
  return (
    <div
      className={cn(styles.root, props.className, {
        [styles.dashed]: props.dashed,
      })}
    >
      {props.children}
    </div>
  );
};

export default Line;
