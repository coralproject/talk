import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Main.css";

export interface MainProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

const Main: FunctionComponent<MainProps> = ({
  children,
  className,
  ...rest
}) => (
  <main {...rest} className={cn(styles.root, className)}>
    {children}
  </main>
);

export default Main;
