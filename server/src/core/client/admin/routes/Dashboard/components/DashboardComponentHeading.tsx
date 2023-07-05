import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./DashboardComponentHeading.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const DashboardComponentHeading: FunctionComponent<Props> = ({
  children,
  className,
}) => {
  return <h3 className={cn(styles.root, className)}>{children}</h3>;
};

export default DashboardComponentHeading;
