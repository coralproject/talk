import { useEffect, useState } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";

function isOnline() {
  return typeof navigator !== "undefined" &&
    typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;
}

/**
 * Returns a boolean indicating the network online status.
 */
export default function useOnlineStatus() {
  const { window } = useCoralContext();
  const [onlineStatus, setOnlineStatus] = useState(isOnline());
  const handleOnline = () => setOnlineStatus(true);
  const handleOffline = () => setOnlineStatus(false);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [window]);

  return onlineStatus;
}
