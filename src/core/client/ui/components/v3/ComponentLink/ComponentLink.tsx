import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./ComponentLink.css";

const ComponentLink: FunctionComponent<{
  href: string;
  children: React.Component | Element | React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => (
  <a href={href} className={cn(styles.root, className)}>
    {children}
  </a>
);

export default ComponentLink;
