import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Username.css";

interface Props {
  className: string;
  children: React.ReactNode;
}

const Username: FunctionComponent<Props> = ({ className, children }) => (
  <span className={cn(className, styles.root)}>{children}</span>
);

export default Username;
