import React from "react";
import { StatelessComponent } from "react";

import { RelativeTime } from "talk-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  children: string;
}

const Timestamp: StatelessComponent<TimestampProps> = props => (
  <RelativeTime className={styles.root} date={props.children} />
);

export default Timestamp;
