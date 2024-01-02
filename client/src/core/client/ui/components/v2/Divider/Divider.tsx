import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Divider.css";

interface Props {
  spacing?: 1 | 2 | 3 | 4;
  horizontalSpacing?: 1 | 2 | 3 | 4;
}

const Divider: FunctionComponent<Props> = ({
  spacing = 3,
  horizontalSpacing = 0,
}) => {
  return (
    <hr
      className={cn(styles.root, {
        [styles.spacing1]: spacing && spacing === 1,
        [styles.spacing2]: spacing && spacing === 2,
        [styles.spacing3]: spacing && spacing === 3,
        [styles.spacing4]: spacing && spacing === 4,
        [styles.horizontallySpaced1]:
          horizontalSpacing && horizontalSpacing === 1,
        [styles.horizontallySpaced2]:
          horizontalSpacing && horizontalSpacing === 2,
        [styles.horizontallySpaced3]:
          horizontalSpacing && horizontalSpacing === 3,
        [styles.horizontallySpaced4]:
          horizontalSpacing && horizontalSpacing === 4,
      })}
    />
  );
};

export default Divider;
