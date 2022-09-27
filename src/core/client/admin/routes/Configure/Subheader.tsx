import React, { FunctionComponent } from "react";

import styles from "./Subheader.css";

interface SubheaderProps {
  children?: React.ReactNode;
}

const Subheader: FunctionComponent<SubheaderProps> = ({ children }) => (
  <h3 className={styles.root}>{children}</h3>
);

export default Subheader;
