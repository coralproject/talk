import React, { FunctionComponent, HTMLAttributes } from "react";

import styles from "./ModalHeader.css";

const ModalHeader: FunctionComponent<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  ...rest
}) => {
  return (
    <h2 {...rest} className={styles.root}>
      {children}
    </h2>
  );
};

export default ModalHeader;
