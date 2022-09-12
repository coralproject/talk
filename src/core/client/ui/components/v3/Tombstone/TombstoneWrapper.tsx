import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./TombstoneWrapper.css";

interface Props {
  noBottomBorder?: boolean;
  children?: React.ReactNode;
}

const TombstoneWrapper: FunctionComponent<Props> = ({
  noBottomBorder,
  children,
}) => {
  const className = noBottomBorder
    ? styles.root
    : cn(styles.root, styles.border);
  return <div className={className}>{children}</div>;
};

export default TombstoneWrapper;
