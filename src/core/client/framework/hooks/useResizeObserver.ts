import { useEffect, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";

export default function useResizeObserver(
  cb: (entry: ResizeObserverEntry) => void
) {
  const ref = useRef<any>(null);
  useEffect(() => {
    const element = ref.current;
    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (entries.length === 0) {
          return;
        }
        // We are only observing one element.
        const entry = entries[0];
        cb(entry);
      });
      resizeObserver.observe(element);
      return () => resizeObserver.unobserve(element);
    }
    return;
  }, [ref.current]);
  return ref;
}
