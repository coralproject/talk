import { useCallback, useEffect, useRef } from "react";

interface Options {
  intervalMs: number;
  thresholdMs: number;
}

const useOnResumeActive = (
  onResume: () => void,
  options: Options = {
    intervalMs: 500,
    thresholdMs: 1500,
  }
) => {
  const intervalRef = useRef<number | null>(null);
  const prevTime = useRef<number | null>(null);

  const heartbeat = useCallback(() => {
    if (prevTime.current) {
      const now = Date.now();
      const diff = now - prevTime.current;

      if (diff >= options.thresholdMs) {
        onResume();
      }

      prevTime.current = now;
    }
  }, [onResume, options.thresholdMs]);

  useEffect(() => {
    prevTime.current = Date.now();
    intervalRef.current = window.setInterval(heartbeat, options.intervalMs);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [options.intervalMs, heartbeat]);

  return { options, onResume };
};

export default useOnResumeActive;
