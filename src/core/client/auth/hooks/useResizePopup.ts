import { useCallback, useEffect, useState } from "react";

import { useResizeObserver } from "coral-framework/hooks";

import resizePopup from "../dom/resizePopup";

export default function useResizePopup() {
  const [polling, setPolling] = useState(true);
  const [pollTimeout, setPollTimeout] = useState<NodeJS.Timer | null>(null);

  const pollPopupHeight = useCallback(
    (interval: number = 200) => {
      if (!polling) {
        return;
      }

      // Save the reference to the browser timeout we create.
      setPollTimeout(
        // Create the timeout to fire after the interval.
        setTimeout(() => {
          // Using requestAnimationFrame, resize the popup, and reschedule the
          // resize timeout again in another interval.
          window.requestAnimationFrame(() => {
            resizePopup();
            pollPopupHeight(interval);
          });
        }, interval)
      );
    },
    [pollTimeout, setPollTimeout, polling]
  );

  useEffect(() => {
    // Poll for popup height changes.
    pollPopupHeight();

    return () => {
      if (pollTimeout) {
        clearTimeout(pollTimeout);
        setPollTimeout(null);
        setPolling(false);
      }
    };
  }, [setPollTimeout, setPolling]);

  const ref = useResizeObserver(() => {
    resizePopup();
  });
  return ref;
}
