import React, { FunctionComponent } from "react";

import { RelativeTime } from "coral-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  children: string;
}

const Timestamp: FunctionComponent<TimestampProps> = props => (
  <RelativeTime className={styles.root} date={props.children} />
);

export default Timestamp;
