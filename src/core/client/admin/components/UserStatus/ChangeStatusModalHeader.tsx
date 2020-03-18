import React, { FunctionComponent, HTMLAttributes } from "react";

import styles from "./ChangeStatusModalHeader.css";

const ChangeStatusModalHeader: FunctionComponent<HTMLAttributes<
  HTMLHeadingElement
>> = ({ children, ...rest }) => {
  return (
    <h2 {...rest} className={styles.root}>
      {children}
    </h2>
  );
};

export default ChangeStatusModalHeader;
