import React, { FunctionComponent } from "react";

import styles from "./SubHeader.css";

const SubHeader: FunctionComponent = ({ children }) => (
  <h3 className={styles.root}>{children}</h3>
);

export default SubHeader;
