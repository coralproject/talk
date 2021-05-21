import React, { FunctionComponent } from "react";

import styles from "./Timestamp.css";
import TimestampFormatter from "./TimestampFormatter";

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
  return (
    <TimestampFormatter
      className={className}
      rootClassName={styles.root}
      textClassName={styles.text}
      toggleAbsolute={toggleAbsolute}
      onToggleAbsolute={onToggleAbsolute}
    >
      {children}
    </TimestampFormatter>
  );
};

Timestamp.defaultProps = {
  toggleAbsolute: true,
};

export default Timestamp;
