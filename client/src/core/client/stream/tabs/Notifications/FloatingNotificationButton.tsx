import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import { LiveBellIcon } from "./LiveBellIcon";

import styles from "./FloatingNotificationButton.css";

interface Props {
  viewerID?: string;
}

const FloatingNotificationButton: FunctionComponent<Props> = ({ viewerID }) => {
  const { window } = useCoralContext();
  const [leftPos, setLeftPos] = useState<number>(0);
  const [topPos, setTopPos] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

  if (!viewerID || !isLoaded) {
    return null;
  }

  return (
    <div
      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
      className={styles.root}
    >
      <LiveBellIcon userID={viewerID} size="lg" />
    </div>
  );
};

export default FloatingNotificationButton;
