import React, { FunctionComponent } from "react";

import styles from "./Label.css";

interface Props {
  className?: string;
}

const Label: FunctionComponent<Props> = ({ children }) => {
  return <p className={styles.root}>{children}</p>;
};

export default Label;
