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
}

export const LiveBellIcon: FunctionComponent<Props> = () => {
  const [{ notificationCount }] = useLocal<LiveBellIconLocal>(graphql`
    fragment LiveBellIconLocal on Local {
      notificationCount
    }
  `);

  const count = useMemo(() => {
    if (!notificationCount) {
      return "";
    }

    if (notificationCount <= 0) {
      return "";
    }

    if (notificationCount > 20) {
      return "20+";
    }

    return `${notificationCount}`;
  }, [notificationCount]);

  return (
    <div className={cn(CLASSES.notifications.live.root, styles.icon)}>
      <SvgIcon
        className={CLASSES.notifications.live.icon}
        strokeWidth="thin"
        size="lg"
        Icon={NotificationBellIcon}
      />
      {notificationCount && notificationCount > 0 && (
        <div className={cn(CLASSES.notifications.live.counter, styles.counter)}>
          {count}
        </div>
      )}
    </div>
  );
};
