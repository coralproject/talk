import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import { AbsoluteTime, BaseButton, RelativeTime } from "coral-ui/components/v2";

import styles from "./Timestamp.css";

export interface TimestampProps {
  className?: string;
  children: string;
  toggleAbsolute?: boolean;
  onToggleAbsolute?: (showAbsolute: boolean) => void;
}

const Timestamp: FunctionComponent<TimestampProps> = (props) => {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const toggleShowAbsolute = useCallback(() => {
    if (props.toggleAbsolute) {
      if (props.onToggleAbsolute) {
        props.onToggleAbsolute(!showAbsolute);
      }

      setShowAbsolute(!showAbsolute);
    }
  }, [showAbsolute, setShowAbsolute, props]);
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
