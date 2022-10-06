import React, { FunctionComponent } from "react";

import styles from "./ModalHeaderUsername.css";

const ModalHeaderUsername: FunctionComponent = ({ children }) => {
  return <strong className={styles.root}>{children}</strong>;
};

export default ModalHeaderUsername;
