import { useCallback, useEffect, useRef } from "react";

import useResizeObserver from "use-resize-observer/polyfilled";

import resizePopup from "../dom/resizePopup";

export default function useResizePopup() {
  const polling = useRef(true);
  const pollTimeout = useRef<number | null>(null);

  const pollPopupHeight = useCallback((interval = 200) => {
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
          resizePopup();
          pollPopupHeight(interval);
        });
      }, interval);
  }, []);

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
  }, [pollPopupHeight]);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: () => resizePopup(),
  });
  return ref;
}
