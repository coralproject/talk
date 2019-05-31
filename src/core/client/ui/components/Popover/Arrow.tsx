import cn from "classnames";
import React from "react";

import styles from "./Arrow.css";

const Arrow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} className={cn(props.className, styles.root)} ref={ref} />
));

export default Arrow;
