import React, { FunctionComponent } from "react";

import styles from "./ModalHeaderUsername.css";

interface ModalHeaderUsernameProps {
  children?: React.ReactNode;
}

const ModalHeaderUsername: FunctionComponent<ModalHeaderUsernameProps> = ({
  children,
}) => {
  return <strong className={styles.root}>{children}</strong>;
};

export default ModalHeaderUsername;
