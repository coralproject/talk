import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Divider.css";

interface Props {
  spacing?: 1 | 2 | 3 | 4;
}

const Divider: FunctionComponent<Props> = ({ spacing = 3 }) => {
  return (
    <hr
      className={cn(styles.root, {
        [styles.spacing1]: spacing && spacing === 1,
        [styles.spacing2]: spacing && spacing === 2,
        [styles.spacing3]: spacing && spacing === 3,
        [styles.spacing4]: spacing && spacing === 4,
      })}
    />
  );
};

export default Divider;
