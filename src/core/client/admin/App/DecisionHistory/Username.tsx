import React, { FunctionComponent } from "react";

import styles from "./Username.css";

const Username: FunctionComponent<{ username: string }> = ({ username }) => (
  <strong className={styles.root}>{username}</strong>
);

export default Username;
