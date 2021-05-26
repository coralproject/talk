import { useEffect, useState } from "react";

function isOnline() {
  return typeof navigator !== "undefined" &&
    typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;
}

export default function useOnlineStatus() {
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
  }, []);

  return onlineStatus;
}
