import cn from "classnames";
import React, { StatelessComponent } from "react";

import styles from "./MainLayout.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const MainLayout: StatelessComponent<Props> = ({
  children,
  className,
  ...rest
}) => (
  <div {...rest} className={cn(styles.root, className)}>
    {children}
  </div>
);

export default MainLayout;
