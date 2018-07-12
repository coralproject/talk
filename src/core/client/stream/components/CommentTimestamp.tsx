import React from "react";
import { StatelessComponent } from "react";

import { RelativeTime } from "talk-ui/components";

import * as styles from "./CommentTimestamp.css";

export interface CommentTimestampProps {
  children: string;
}

const CommentTimestamp: StatelessComponent<CommentTimestampProps> = props => (
  <RelativeTime className={styles.root} date={props.children} />
);

export default CommentTimestamp;
