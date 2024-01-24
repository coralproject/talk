import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import styles from "./FloatingNotificationButton.css";
import { LiveBellIcon } from "./LiveBellIcon";

interface Props {
  viewerID?: string;
}

const FloatingNotificationButton: FunctionComponent<Props> = ({ viewerID }) => {
  const { window } = useCoralContext();
  const [leftPos, setLeftPos] = useState<number>(0);
  const onWindowResize = useCallback(() => {
    const element = window.document.getElementById("coral-shadow-container");
    const rect = element?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setLeftPos(rect.left + rect.width - 65);
  }, [window.document]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    onWindowResize();

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize, window]);

  if (!viewerID) {
    return null;
  }

  return (
    <div style={{ left: `${leftPos}px` }} className={styles.root}>
      <LiveBellIcon userID={viewerID} size="lg" />
    </div>
  );
};

export default FloatingNotificationButton;
