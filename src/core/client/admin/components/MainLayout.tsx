import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./MainLayout.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const MainLayout: FunctionComponent<Props> = ({
  children,
  className,
  ...rest
}) => (
  <div {...rest} className={cn(styles.root, className)}>
    {children}
  </div>
);

export default MainLayout;
