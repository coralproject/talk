import React, { FunctionComponent } from "react";

import { Timestamp } from "coral-ui/components/v2";

import styles from "./Timestamp.css";

interface Props {
  children: string;
}

const DecisionHistory: FunctionComponent<Props> = (props) => (
  <Timestamp className={styles.root}>{props.children}</Timestamp>
);

export default DecisionHistory;
