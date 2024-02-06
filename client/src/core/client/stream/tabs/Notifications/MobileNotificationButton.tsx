import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { ButtonSvgIcon, RemoveIcon } from "coral-ui/components/icons";

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
        <div
          className={styles.container}
          aria-hidden="true"
          onClick={onToggleOpen}
        >
          <div className={styles.tray}>
            <div className={styles.header}>
              <Localized id="notifications-title">Notifications</Localized>
              <Localized
                id="comments-mobileToolbar-notifications-closeButton"
                attrs={{ "aria-label": true }}
              >
                <button
                  onClick={onToggleOpen}
                  aria-label="Close notifications"
                  className={styles.closeButton}
                >
                  <ButtonSvgIcon size="lg" Icon={RemoveIcon} />
                </button>
              </Localized>
            </div>
            <div className={styles.list}>
              <NotificationsQuery showUserBox={false} showTitle={false} />
            </div>
          </div>
        </div>
      )}
      <button className={styles.button} onClick={onToggleOpen}>
        <LiveBellIcon userID={viewerID} size="lg" style="tray" />
      </button>
    </>
  );
};
