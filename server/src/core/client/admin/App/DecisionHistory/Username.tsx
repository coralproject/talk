import React, { FunctionComponent } from "react";

import styles from "./Username.css";

interface Props {
  username: string;
}

const Username: FunctionComponent<Props> = ({ username }) => (
  <strong className={styles.root}>{username}</strong>
);

export default Username;
