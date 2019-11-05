import React, { FunctionComponent, HTMLAttributes } from "react";

import styles from "./ChangeStatusModalHeader.css";

const ChangeStatusModalHeader: FunctionComponent<
  HTMLAttributes<HTMLHeadingElement>
> = ({ children }) => {
  return <h2 className={styles.root}>{children}</h2>;
};

export default ChangeStatusModalHeader;
