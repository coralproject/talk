import cn from "classnames";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import {
  AbsoluteTime,
  BaseButton,
  RelativeTime,
  UIContext,
} from "coral-ui/components";

import styles from "./Timestamp.css";

export interface TimestampProps {
  className?: string;
  children: string;
  toggleAbsolute?: boolean;
  onToggleAbsolute?: (absolute: boolean) => void;
  onClick?: EventHandler<MouseEvent>;
}

const Timestamp: FunctionComponent<TimestampProps> = props => {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const handleOnClick = useCallback(
    (event: MouseEvent) => {
      if (props.toggleAbsolute) {
        if (props.onToggleAbsolute) {
          props.onToggleAbsolute(!showAbsolute);
        }
        setShowAbsolute(!showAbsolute);
      }
      if (props.onClick) {
        return props.onClick(event);
      }
    },
    [showAbsolute, setShowAbsolute, props.onClick]
  );
  return (
    <UIContext.Consumer>
      {({ locales }) => (
        <BaseButton className={styles.root} onClick={handleOnClick}>
          {showAbsolute && locales ? (
            <AbsoluteTime
              date={props.children}
              locales={locales}
              className={cn(styles.text, props.className)}
            />
          ) : (
            <RelativeTime
              className={cn(styles.text, props.className)}
              date={props.children}
            />
          )}
        </BaseButton>
      )}
    </UIContext.Consumer>
  );
};

Timestamp.defaultProps = {
  toggleAbsolute: true,
};

export default Timestamp;
