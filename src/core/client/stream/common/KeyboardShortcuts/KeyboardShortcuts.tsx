import { FunctionComponent, useEffect } from "react";

import { onPymMessage } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface KeyboardEventData {
  key: string;
  shiftKey: boolean;
}

interface KeyStop {
  id: string;
  isLoadMore: boolean;
  element: HTMLElement;
}

const getKeyStops = () =>
  document.querySelectorAll<HTMLElement>("[data-key-stop]");

const toKeyStop = (element: HTMLElement): KeyStop => {
  const id = element.id;
  const isLoadMore = "isLoadMore" in element.dataset;

  return {
    element,
    id,
    isLoadMore,
  };
};

const findNextElement = (currentStop: KeyStop | null): KeyStop | null => {
  const stops = getKeyStops();
  if (stops.length === 0) {
    return null;
  }

  // There is no current stop, so return the first one!
  if (!currentStop) {
    return toKeyStop(stops[0]);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let index = 0; index < stops.length; index++) {
    if (stops[index].id === currentStop.id) {
      if (index === stops.length - 1) {
        // We're at the last one, get the first one!
        return toKeyStop(stops[0]);
      }

      // Go one more element forward.
      return toKeyStop(stops[index + 1]);
    }
  }

  // We couldn't find your current element to get the next one! Go to the first
  // stop.
  return toKeyStop(stops[0]);
};

const findPreviousElement = (currentStop: KeyStop | null): KeyStop | null => {
  const stops = getKeyStops();
  if (stops.length === 0) {
    return null;
  }

  // There is no current stop, get the last one!
  if (!currentStop) {
    return toKeyStop(stops[stops.length - 1]);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let index = 0; index < stops.length; index++) {
    if (stops[index].id === currentStop.id) {
      if (index === 0) {
        // We are the first element, get the last one!
        return toKeyStop(stops[stops.length - 1]);
      }

      // Get one element before the current index!
      return toKeyStop(stops[index - 1]);
    }
  }

  // We couldn't find your current element to get the previous one! Go to the
  // first stop.
  return toKeyStop(stops[0]);
};

const KeyboardShortcuts: FunctionComponent = ({ children }) => {
  const { pym } = useCoralContext();
  useEffect(() => {
    if (!pym) {
      return;
    }

    // Store a reference to the current stop.
    let currentStop: KeyStop | null = null;

    const handle = (event: KeyboardEvent | string) => {
      let data: KeyboardEventData;

      try {
        if (typeof event === "string") {
          data = JSON.parse(event);
        } else {
          if (event.target) {
            const el = event.target as HTMLElement;
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
              return;
            }
            if (el.getAttribute("contenteditable") === "true") {
              return;
            }
          }
          data = event;
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error(err);
        }

        return;
      }

      let stop: KeyStop | null = null;
      if (data.shiftKey && data.key === "C") {
        stop = findPreviousElement(currentStop);
      } else if (data.key === "c") {
        stop = findNextElement(currentStop);
      }

      if (!stop) {
        return;
      }

      pym.scrollParentToChildEl(stop.id);

      if (stop.isLoadMore) {
        stop.element.click();
      } else {
        currentStop = stop;
      }
    };

    const unsubscribe = onPymMessage(pym, "keypress", handle);
    window.addEventListener("keypress", handle);

    return () => {
      unsubscribe();
      window.removeEventListener("keypress", handle);
    };
  }, [pym]);

  return null;
};

export default KeyboardShortcuts;
