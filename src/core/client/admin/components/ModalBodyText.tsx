import React, { FunctionComponent } from "react";

import styles from "./ModalBodyText.css";

const ModalBodyText: FunctionComponent = ({ children }) => (
  <p className={styles.root}>{children}</p>
);

export default ModalBodyText;
