import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import { AbsoluteTime, RelativeTime } from "coral-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  children: string;
  className?: string;
  toggleAbsolute?: boolean;
}

const Timestamp: FunctionComponent<TimestampProps> = props => {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const toggleShowAbsolute = useCallback(() => {
    if (props.toggleAbsolute) {
      setShowAbsolute(!showAbsolute);
    }
  }, [showAbsolute, setShowAbsolute]);
  return (
    <div className={styles.root} onClick={toggleShowAbsolute}>
      {showAbsolute ? (
        <AbsoluteTime
          date={props.children}
          className={cn(styles.root, props.className)}
        />
      ) : (
        <RelativeTime
          className={cn(styles.root, props.className)}
          date={props.children}
        />
      )}
    </div>
  );
};

Timestamp.defaultProps = {
  toggleAbsolute: true,
};

export default Timestamp;
