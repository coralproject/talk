import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Main.css";

export interface MainProps {
  className?: string;
  children: React.ReactNode;
}

const Main: FunctionComponent<MainProps> = ({
  children,
  className,
  ...rest
}) => (
  <div {...rest} className={cn(styles.root, className)}>
    {children}
  </div>
);

export default Main;
