import { useCallback, useEffect, useRef } from "react";

import { useResizeObserver } from "coral-framework/hooks";

import resizePopup from "../dom/resizePopup";

export default function useResizePopup() {
  const pollTimeout = useRef<any>();

  const pollPopupHeight = useCallback((interval = 200) => {
    // Save the reference to the browser timeout we create.
    pollTimeout.current =
      // Create the timeout to fire after the interval.
      setTimeout(() => {
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
        clearTimeout(pollTimeout.current);
        pollTimeout.current = null;
      }
    };
  }, []);

  const ref = useResizeObserver(() => {
    resizePopup();
  });
  return ref;
}
