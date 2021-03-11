import { useCallback, useEffect, useRef } from "react";

const useHeartbeat = (
  onHeartbeat: (seconds: number) => void,
  expectedIntervalMs: number
) => {
  const intervalRef = useRef<number | null>(null);
  const time = useRef<number | null>(null);

  const heartbeat = useCallback(() => {
    if (time.current) {
      const now = Date.now();
      onHeartbeat(now - time.current);
      time.current = now;
    }
  }, [onHeartbeat]);

  useEffect(() => {
    time.current = Date.now();
    intervalRef.current = window.setInterval(heartbeat, expectedIntervalMs);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [expectedIntervalMs, heartbeat]);

  return { expectedIntervalMs, onHeartbeat };
};

export default useHeartbeat;
