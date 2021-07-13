import { FunctionComponent, useEffect } from "react";

import { onPymMessage } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";

export interface KeyboardEventData {
  key: string;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

interface KeyStop {
  id: string;
  isLoadMore: boolean;
  element: HTMLElement;
  notSeen: boolean;
}

interface TraverseOptions {
  skipSeen?: boolean;
}

const toKeyStop = (element: HTMLElement): KeyStop => {
  const id = element.id;
  const isLoadMore = "isLoadMore" in element.dataset;
  const notSeen = "notSeen" in element.dataset;

  return {
    element,
    id,
    isLoadMore,
    notSeen,
  };
};

const matchTraverseOptions = (stop: KeyStop, options: TraverseOptions) =>
  !options.skipSeen || stop.notSeen || stop.isLoadMore;

const getKeyStops = () => {
  const stops: KeyStop[] = [];
  document
    .querySelectorAll<HTMLElement>("[data-key-stop]")
    .forEach((el) => stops.push(toKeyStop(el)));
  return stops;
};

const getFirstKeyStop = (stops: KeyStop[], options: TraverseOptions = {}) => {
  for (const stop of stops) {
    if (!matchTraverseOptions(stop, options)) {
      continue;
    }
    return stop;
  }
  return null;
};
const getLastKeyStop = (stops: KeyStop[], options: TraverseOptions = {}) => {
  for (const stop of stops.reverse()) {
    if (!matchTraverseOptions(stop, options)) {
      continue;
    }
    return stop;
  }
  return null;
};

const findNextKeyStop = (
  currentStop: KeyStop | null,
  options: TraverseOptions = {}
): KeyStop | null => {
  const stops = getKeyStops();
  if (stops.length === 0) {
    return null;
  }

  // There is no current stop, so return the first one!
  if (!currentStop) {
    return getFirstKeyStop(stops, options);
  }

  let passedCurrentStop = false;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let index = 0; index < stops.length; index++) {
    if (stops[index].id === currentStop.id) {
      passedCurrentStop = true;
      continue;
    }
    if (passedCurrentStop) {
      if (!matchTraverseOptions(stops[index], options)) {
        continue;
      }
      return stops[index];
    }
  }

  // We couldn't find your current element to get the next one! Go to the first
  // stop.
  return getFirstKeyStop(stops, options);
};

const findPreviousKeyStop = (
  currentStop: KeyStop | null,
  options: TraverseOptions = {}
): KeyStop | null => {
  const stops = getKeyStops();
  if (stops.length === 0) {
    return null;
  }

  // There is no current stop, get the last one!
  if (!currentStop) {
    return getLastKeyStop(stops, options);
  }

  let passedCurrentStop = false;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let index = stops.length - 1; index >= 0; index--) {
    if (stops[index].id === currentStop.id) {
      passedCurrentStop = true;
      continue;
    }
    if (passedCurrentStop) {
      if (!matchTraverseOptions(stops[index], options)) {
        continue;
      }
      return stops[index];
    }
  }

  // We couldn't find your current element to get the previous one! Go to the
  // first stop.
  return getLastKeyStop(stops, options);
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
        globalErrorReporter.report(err);
        return;
      }

      if (data.ctrlKey || data.metaKey || data.altKey) {
        return;
      }

      let stop: KeyStop | null = null;
      if (data.shiftKey && (data.key === "C" || data.key === "Z")) {
        stop = findPreviousKeyStop(currentStop, {
          skipSeen: data.key === "Z",
        });
      } else if (data.key === "c" || data.key === "z") {
        stop = findNextKeyStop(currentStop, {
          skipSeen: data.key === "z",
        });
      }

      if (!stop) {
        return;
      }

      pym.scrollParentToChildEl(stop.id);

      if (stop.isLoadMore) {
        stop.element.click();
        currentStop = findPreviousKeyStop(stop);
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
