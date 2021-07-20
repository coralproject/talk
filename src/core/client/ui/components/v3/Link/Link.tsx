import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Link.css";

const Link: FunctionComponent<{
  href?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => {
  const resolvedHref =
    href || (typeof children === "string" ? children : undefined);
  return (
    <a href={resolvedHref} className={cn(styles.root, className)}>
      {children}
    </a>
  );
};

export default Link;
