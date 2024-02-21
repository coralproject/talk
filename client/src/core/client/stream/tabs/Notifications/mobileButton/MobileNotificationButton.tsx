import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import { ButtonSvgIcon, RemoveIcon } from "coral-ui/components/icons";

import { LiveBellIcon } from "../LiveBellIcon";
import MobileNotificationsQuery from "./MobileNotificationsQuery";

import styles from "./MobileNotificationButton.css";

interface Props {
  viewerID?: string;
  enabled?: boolean;
}

export const MobileNotificationButton: FunctionComponent<Props> = ({
  viewerID,
  enabled,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const stopPropagation = useCallback((ev: MouseEvent) => {
    ev.stopPropagation();
  }, []);

  if (!viewerID) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          id="MobileNotificationButton-container"
          className={styles.container}
          aria-hidden="true"
          onClick={onToggleOpen}
        >
          <div
            className={styles.tray}
            aria-hidden="true"
            onClick={stopPropagation}
          >
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
                  <ButtonSvgIcon size="md" Icon={RemoveIcon} />
                </button>
              </Localized>
            </div>
            <div className={styles.list}>
              <MobileNotificationsQuery showUserBox={false} showTitle={false} />
            </div>
          </div>
        </div>
      )}
      <button className={styles.button} onClick={onToggleOpen}>
        <LiveBellIcon size="lg" style="tray" enabled={enabled} />
      </button>
    </>
  );
};
