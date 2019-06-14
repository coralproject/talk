import cn from "classnames";
import React from "react";
import { FunctionComponent } from "react";

import { RelativeTime } from "coral-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  className?: string;
  children: string;
}

const Timestamp: FunctionComponent<TimestampProps> = props => (
  <RelativeTime
    className={cn(styles.root, props.className)}
    date={props.children}
  />
);

export default Timestamp;
