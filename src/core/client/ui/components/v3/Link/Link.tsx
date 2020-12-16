import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Link.css";

const Link: FunctionComponent<{
  href?: string;
  children?: string;
  className?: string;
}> = ({ href, children, className }) => (
  <a href={href || children} className={cn(styles.root, className)}>
    {children}
  </a>
);

export default Link;
