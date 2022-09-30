import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./ListGroupRow.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const ListGroupRow: FunctionComponent<Props> = ({ className, children }) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};

export default ListGroupRow;
