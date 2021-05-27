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

const Timestamp: FunctionComponent<TimestampProps> = ({
  className,
  children,
  toggleAbsolute,
  onToggleAbsolute,
}) => {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const toggleShowAbsolute = useCallback(() => {
    if (toggleAbsolute) {
      if (onToggleAbsolute) {
        onToggleAbsolute(!showAbsolute);
      }

      setShowAbsolute(!showAbsolute);
    }
  }, [toggleAbsolute, onToggleAbsolute, showAbsolute, setShowAbsolute]);
  return (
    <BaseButton className={styles.root} onClick={toggleShowAbsolute}>
      {showAbsolute ? (
        <AbsoluteTime date={children} className={cn(styles.text, className)} />
      ) : (
        <RelativeTime className={cn(styles.text, className)} date={children} />
      )}
    </BaseButton>
  );
};

Timestamp.defaultProps = {
  toggleAbsolute: true,
};

export default Timestamp;
