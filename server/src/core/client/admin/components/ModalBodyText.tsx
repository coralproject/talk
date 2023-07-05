import React, { FunctionComponent } from "react";

import styles from "./ModalBodyText.css";

interface ModalBodyTextProps {
  children?: React.ReactNode;
}

const ModalBodyText: FunctionComponent<ModalBodyTextProps> = ({ children }) => (
  <p className={styles.root}>{children}</p>
);

export default ModalBodyText;
