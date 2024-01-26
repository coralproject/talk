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
}

export const LiveBellIcon: FunctionComponent<Props> = ({ size = "md" }) => {
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
        className={CLASSES.notifications.live.icon}
        strokeWidth="thin"
        size={size}
        Icon={NotificationBellIcon}
      />
      {count && (
        <div
          className={cn(CLASSES.notifications.live.counter, styles.counter, {
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
