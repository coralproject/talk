import { useCallback, useEffect, useRef } from "react";
import useResizeObserver from "use-resize-observer";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import resizePopup from "../dom/resizePopup";

export default function useResizePopup() {
  const { window } = useCoralContext();
  const polling = useRef(true);
  const pollTimeout = useRef<number | null>(null);

  const pollPopupHeight = useCallback(
    (interval = 200) => {
      if (!polling.current) {
        return;
      }

      // Save the reference to the browser timeout we create.
      pollTimeout.current =
        // Create the timeout to fire after the interval.
        window.setTimeout(() => {
          // Using requestAnimationFrame, resize the popup, and reschedule the
          // resize timeout again in another interval.
          window.requestAnimationFrame(() => {
            resizePopup(window);
            pollPopupHeight(interval);
          });
        }, interval);
    },
    [window]
  );

  useEffect(() => {
    // Poll for popup height changes.
    pollPopupHeight();

    return () => {
      if (pollTimeout.current) {
        window.clearTimeout(pollTimeout.current);
        pollTimeout.current = null;
        polling.current = false;
      }
    };
  }, [pollPopupHeight, window]);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: () => resizePopup(window),
  });
  return ref;
}
