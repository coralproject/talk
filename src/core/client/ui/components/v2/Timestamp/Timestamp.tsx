import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import { AbsoluteTime, BaseButton, RelativeTime } from "coral-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  className?: string;
  children: string;
  toggleAbsolute?: boolean;
}

const Timestamp: FunctionComponent<TimestampProps> = (props) => {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const toggleShowAbsolute = useCallback(() => {
    if (props.toggleAbsolute) {
      setShowAbsolute(!showAbsolute);
    }
  }, [showAbsolute, setShowAbsolute]);
  return (
    <BaseButton className={styles.root} onClick={toggleShowAbsolute}>
      {showAbsolute ? (
        <AbsoluteTime
          date={props.children}
          className={cn(styles.text, props.className)}
        />
      ) : (
        <RelativeTime
          className={cn(styles.text, props.className)}
          date={props.children}
        />
      )}
    </BaseButton>
  );
};

Timestamp.defaultProps = {
  toggleAbsolute: true,
};

export default Timestamp;
