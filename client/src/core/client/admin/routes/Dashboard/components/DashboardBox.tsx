import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./DashboardBox.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const DashboardBox: FunctionComponent<Props> = ({ children, className }) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};

export default DashboardBox;
