import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import { AbsoluteTime, BaseButton, RelativeTime } from "coral-ui/components/v2";

export interface TimestampFormatterProps {
  className?: string;
  rootClassName?: string;
  textClassName?: string;
  children: string;
  toggleAbsolute?: boolean;
  onToggleAbsolute?: (showAbsolute: boolean) => void;
}

const TimestampFormatter: FunctionComponent<TimestampFormatterProps> = ({
  toggleAbsolute,
  onToggleAbsolute,
  children,
  textClassName,
  rootClassName,
  className,
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
    <BaseButton className={rootClassName} onClick={toggleShowAbsolute}>
      {showAbsolute ? (
        <AbsoluteTime
          date={children}
          className={cn(textClassName, className)}
        />
      ) : (
        <RelativeTime
          className={cn(textClassName, className)}
          date={children}
        />
      )}
    </BaseButton>
  );
};

TimestampFormatter.defaultProps = {
  toggleAbsolute: true,
};

export default TimestampFormatter;
