import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import { LiveBellIcon } from "./LiveBellIcon";

import styles from "./FloatingNotificationButton.css";
import NotificationsQuery from "./NotificationsQuery";

interface Props {
  viewerID?: string;
}

const FloatingNotificationButton: FunctionComponent<Props> = ({ viewerID }) => {
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
    setIsLoaded(true);
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
    setTimeout(onWindowResize, 2000);

    window.addEventListener("scroll", onWindowScroll);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, [onWindowResize, onWindowScroll, window]);

  const onToggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  if (!viewerID || !isLoaded) {
    return null;
  }

  return (
    <div
      className={styles.root}
      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
    >
      <button className={styles.button} onClick={onToggleOpen}>
        <LiveBellIcon userID={viewerID} size="lg" />
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
