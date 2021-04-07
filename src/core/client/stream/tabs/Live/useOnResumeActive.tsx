import { useCallback, useEffect, useRef } from "react";

const useOnResumeActive = (onResume: () => void, onPause?: () => void) => {
  const hidden = useRef<string | null>(null);
  const visibilityChange = useRef<string | null>(null);

  const handleVisibilityChange = useCallback(() => {
    if (!hidden.current || !visibilityChange.current) {
      return;
    }
    const doc = document as any;

    if (doc[hidden.current] && onPause) {
      onPause();
    } else {
      onResume();
    }
  }, [onPause, onResume]);

  useEffect(() => {
    const doc = document as any;
    if (typeof doc.hidden !== "undefined") {
      hidden.current = "hidden";
      visibilityChange.current = "visibilitychange";
    } else if (typeof doc.msHidden !== "undefined") {
      hidden.current = "msHidden";
      visibilityChange.current = "msvisibilitychange";
    } else if (typeof doc.webkitHidden !== "undefined") {
      hidden.current = "webkitHidden";
      visibilityChange.current = "webkitvisibilitychange";
    }

    if (
      typeof document.addEventListener === "undefined" ||
      !hidden.current ||
      !visibilityChange.current
    ) {
      return;
    } else {
      document.addEventListener(
        visibilityChange.current,
        handleVisibilityChange,
        false
      );
    }

    return () => {
      if (!visibilityChange.current) {
        return;
      }

      document.removeEventListener(
        visibilityChange.current,
        handleVisibilityChange,
        false
      );
    };
  }, [handleVisibilityChange, onResume]);
};

export default useOnResumeActive;
