import cn from "classnames";
import { useLocal } from "coral-framework/lib/relay";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "relay-runtime";

import { LiveBellIconLocal } from "coral-stream/__generated__/LiveBellIconLocal.graphql";
import CLASSES from "coral-stream/classes";
import { NotificationBellIcon, SvgIcon } from "coral-ui/components/icons";
import styles from "./LiveBellIcon.css";

interface Props {
  userID?: string;
  size?: "md" | "lg";
  style?: "default" | "filled" | "blank";
}

export const LiveBellIcon: FunctionComponent<Props> = ({
  size = "md",
  style = "default",
}) => {
  const [{ notificationCount }] = useLocal<LiveBellIconLocal>(graphql`
    fragment LiveBellIconLocal on Local {
      notificationCount
    }
  `);

  const count = useMemo(() => {
    if (!notificationCount) {
      return null;
    }

    if (notificationCount <= 0) {
      return null;
    }

    if (notificationCount > 20) {
      return "20+";
    }

    return `${notificationCount}`;
  }, [notificationCount]);

  return (
    <div
      className={cn(CLASSES.notifications.live.root, styles.root, {
        [styles.rootMed]: size === "md",
        [styles.rootLarge]: size === "lg",
      })}
    >
      <SvgIcon
        className={cn(CLASSES.notifications.live.icon, styles.defaultStroke, {
          [styles.defaultBell]: style === "default",
          [styles.filledBell]: style === "filled",
          [styles.blankBell]: style === "blank",
        })}
        size={size}
        Icon={NotificationBellIcon}
      />
      {count && (
        <div
          className={cn(CLASSES.notifications.live.counter, styles.counter, {
            [styles.counterBlue]: style === "default" || style === "filled",
            [styles.counterWhite]: style === "blank",
            [styles.counterMed]: size === "md",
            [styles.counterLarge]: size === "lg",
          })}
        >
          {count}
        </div>
      )}
    </div>
  );
};
