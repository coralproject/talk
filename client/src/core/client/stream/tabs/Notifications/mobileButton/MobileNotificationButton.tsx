import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import { useGetMessage } from "coral-framework/lib/i18n";
import CLASSES from "coral-stream/classes";
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
  const getMessage = useGetMessage();
  const title = getMessage("notifications-title", "Notifications");

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
          className={cn(
            CLASSES.notifications.mobileToolBar.root,
            styles.container
          )}
          aria-hidden="true"
          onClick={onToggleOpen}
        >
          <div
            className={cn(
              CLASSES.notifications.mobileToolBar.tray,
              styles.tray
            )}
            aria-hidden="true"
            onClick={stopPropagation}
          >
            <div
              className={cn(
                CLASSES.notifications.mobileToolBar.header,
                styles.header
              )}
            >
              <Localized id="notifications-title">Notifications</Localized>
              <Localized
                id="comments-mobileToolbar-notifications-closeButton"
                attrs={{ "aria-label": true }}
              >
                <button
                  onClick={onToggleOpen}
                  aria-label="Close notifications"
                  className={cn(
                    CLASSES.notifications.mobileToolBar.close,
                    styles.closeButton
                  )}
                >
                  <ButtonSvgIcon size="md" Icon={RemoveIcon} />
                </button>
              </Localized>
            </div>
            <div
              className={cn(
                CLASSES.notifications.mobileToolBar.list,
                styles.list
              )}
            >
              <MobileNotificationsQuery showUserBox={false} showTitle={false} />
            </div>
          </div>
        </div>
      )}
      <button className={styles.button} onClick={onToggleOpen} title={title}>
        <LiveBellIcon size="lg" style="tray" enabled={enabled} />
      </button>
    </>
  );
};
