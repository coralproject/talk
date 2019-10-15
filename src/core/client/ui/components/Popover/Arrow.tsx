import cn from "classnames";
import React from "react";

import styles from "./Arrow.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  dark?: boolean;
}

const Arrow = React.forwardRef<HTMLDivElement, Props>(function Arrow(
  { className, dark, ...rest },
  ref
) {
  return (
    <div
      {...rest}
      className={cn(className, styles.root, {
        [styles.colorDark]: dark,
      })}
      ref={ref}
    />
  );
});

export default Arrow;
