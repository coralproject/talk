import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { RelativeTime } from "coral-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  className?: string;
  children: string;
}

const Timestamp: FunctionComponent<TimestampProps> = props => (
  <RelativeTime
    className={cn(styles.root, props.className, CLASSES.comment.timestamp)}
    date={props.children}
  />
);

export default Timestamp;
