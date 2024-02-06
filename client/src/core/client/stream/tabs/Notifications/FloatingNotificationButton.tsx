import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "relay-runtime";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";

import { FloatingNotificationButton_local } from "coral-stream/__generated__/FloatingNotificationButton_local.graphql";

import { LiveBellIcon } from "./LiveBellIcon";
import NotificationsQuery from "./NotificationsQuery";

import styles from "./FloatingNotificationButton.css";

interface Props {
  viewerID?: string;
}

const FloatingNotificationButton: FunctionComponent<Props> = ({ viewerID }) => {
  const [{ appTabBarVisible }] =
    useLocal<FloatingNotificationButton_local>(graphql`
      fragment FloatingNotificationButton_local on Local {
        appTabBarVisible
      }
    `);

  const { window } = useCoralContext();
  const [leftPos, setLeftPos] = useState<number>(0);
  const [topPos, setTopPos] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onWindowResize = useCallback(() => {
    const element = window.document.getElementById("coral-shadow-container");
    const rect = element?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setLeftPos(rect.left + rect.width - 65);
  }, [window.document]);

  const onWindowScroll = useCallback(() => {
    const element = window.document.getElementById("coral-shadow-container");
    const rect = element?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    if (rect.bottom < 0) {
      setTopPos(rect.bottom);
    } else if (rect.top < 0) {
      setTopPos(0);
    } else {
      setTopPos(rect.top);
    }
  }, [window.document]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    setTimeout(() => {
      onWindowResize();
      onWindowScroll();
      setIsLoaded(true);
    }, 1500);

    window.addEventListener("scroll", onWindowScroll);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, [onWindowResize, onWindowScroll, window]);

  const onToggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const iconStyle = isOpen ? "filled" : "default";

  if (!viewerID || !isLoaded || appTabBarVisible) {
    return null;
  }

  return (
    <div
      className={styles.root}
      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
    >
      <button
        className={cn(styles.button, {
          [styles.buttonClosed]: !isOpen,
          [styles.buttonOpen]: isOpen,
        })}
        onClick={onToggleOpen}
      >
        <LiveBellIcon userID={viewerID} size="md" style={iconStyle} />
      </button>
      {isOpen && (
        <div className={styles.feedRoot}>
          <div className={styles.feed}>
            <NotificationsQuery showUserBox={false} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingNotificationButton;
