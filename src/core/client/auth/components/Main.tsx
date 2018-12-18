import cn from "classnames";
import React, { StatelessComponent } from "react";

import styles from "./Main.css";

export interface MainProps {
  className?: string;
  children: React.ReactNode;
}

const Main: StatelessComponent<MainProps> = ({
  children,
  className,
  ...rest
}) => (
  <div {...rest} className={cn(styles.root, className)}>
    {children}
  </div>
);

export default Main;
