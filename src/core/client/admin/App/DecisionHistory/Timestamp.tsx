import React, { FunctionComponent } from "react";

import { RelativeTime } from "coral-ui/components/v2";

import styles from "./Timestamp.css";

interface Props {
  children: string;
}

const DecisionHistory: FunctionComponent<Props> = props => (
  <RelativeTime className={styles.root} date={props.children} />
);

export default DecisionHistory;
