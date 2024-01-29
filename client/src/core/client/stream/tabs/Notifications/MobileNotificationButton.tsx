import React, { FunctionComponent, useCallback, useState } from "react";

import { LiveBellIcon } from "./LiveBellIcon";
import NotificationsQuery from "./NotificationsQuery";

import styles from "./MobileNotificationButton.css";

interface Props {
  viewerID?: string;
}

export const MobileNotificationButton: FunctionComponent<Props> = ({
  viewerID,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  if (!viewerID) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className={styles.tray}>
          <NotificationsQuery showUserBox={false} />
        </div>
      )}
      <button className={styles.button} onClick={onToggleOpen}>
        <LiveBellIcon userID={viewerID} size="lg" tray />
      </button>
    </>
  );
};
