import React, { StatelessComponent } from "react";

import { RelativeTime } from "talk-ui/components";

import styles from "./Timestamp.css";

interface Props {
  children: string;
}

const DecisionHistory: StatelessComponent<Props> = props => (
  <RelativeTime className={styles.root} date={props.children} />
);

export default DecisionHistory;
