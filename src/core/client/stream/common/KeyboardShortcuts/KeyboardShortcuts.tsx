import React, { FunctionComponent, useCallback, useEffect } from "react";

import { onPymMessage } from "coral-framework/helpers";
import { useInMemoryState } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import { LOCAL_ID } from "coral-framework/lib/relay/localState";
import lookup from "coral-framework/lib/relay/lookup";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import useCommentSeenEnabled from "coral-stream/tabs/Comments/commentSeen/useCommentSeenEnabled";
import useAMP from "coral-stream/tabs/Comments/helpers/useAMP";
import { Flex } from "coral-ui/components/v2";
import { MatchMedia } from "coral-ui/components/v2/MatchMedia/MatchMedia";
import { Button } from "coral-ui/components/v3/Button/Button";

import MobileToolbar from "../MobileToolbar";

export interface KeyboardEventData {
  key: string;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}

interface KeyStop {
  id: string;
  isLoadMore: boolean;
  element: HTMLElement;
  notSeen: boolean;
}

interface TraverseOptions {
  skipSeen?: boolean;
  skipLoadMore?: boolean;
}

const toKeyStop = (element: HTMLElement): KeyStop => {
  return {
    element,
    id: element.id,
    isLoadMore: "isLoadMore" in element.dataset,
    notSeen: "notSeen" in element.dataset,
  };
};

const matchTraverseOptions = (stop: KeyStop, options: TraverseOptions) => {
  if (options.skipLoadMore && stop.isLoadMore) {
    return false;
  }
  if (options.skipSeen && !stop.notSeen && !stop.isLoadMore) {
    return false;
  }
  return true;
};

const getKeyStops = (window: Window) => {
  const stops: KeyStop[] = [];
  window.document
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
  window: Window,
  currentStop: KeyStop | null,
  options: TraverseOptions = {}
): KeyStop | null => {
  const stops = getKeyStops(window);
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
  window: Window,
  currentStop: KeyStop | null,
  options: TraverseOptions = {}
): KeyStop | null => {
  const stops = getKeyStops(window);
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
  const { pym, relayEnvironment, renderWindow } = useCoralContext();
  const [toolbarClosed, setToolbarClosed] = useInMemoryState(
    "keyboardShortcutMobileToolbarClosed",
    false
  );
  const amp = useAMP();
  const commentSeenEnabled = useCommentSeenEnabled();
  const handle = useCallback(
    (event: KeyboardEvent | string) => {
      if (!pym) {
        return;
      }

      let data: KeyboardEventData;

      const currentCommentID = lookup(relayEnvironment, LOCAL_ID)
        .commentWithTraversalFocus;
      const currentCommentElement = renderWindow.document.getElementById(
        computeCommentElementID(currentCommentID)
      );
      const currentStop =
        currentCommentElement && toKeyStop(currentCommentElement);
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
      if (data.shiftKey) {
        if (data.key === "C") {
          stop = findPreviousKeyStop(renderWindow, currentStop);
        } else if (commentSeenEnabled && data.key === "Z") {
          stop = findPreviousKeyStop(renderWindow, currentStop, {
            skipSeen: true,
          });
        }
      } else if (data.key === "c") {
        stop = findNextKeyStop(renderWindow, currentStop);
      } else if (commentSeenEnabled && data.key === "z") {
        stop = findNextKeyStop(renderWindow, currentStop, {
          skipSeen: true,
        });
      }

      if (!stop) {
        return;
      }
      const offset =
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        renderWindow.document.getElementById(stop.id)!.getBoundingClientRect()
          .top +
        renderWindow.pageYOffset -
        150;
      pym.scrollParentToChildPos(offset);

      if (stop.isLoadMore) {
        stop.element.click();
        const prevStop = findPreviousKeyStop(renderWindow, stop, {
          skipLoadMore: true,
        });
        if (prevStop) {
          prevStop.element.focus();
        }
      } else {
        stop.element.focus();
      }
    },
    [commentSeenEnabled, pym, relayEnvironment, renderWindow]
  );

  useEffect(() => {
    if (!pym) {
      return;
    }

    const unsubscribe = onPymMessage(pym, "keypress", handle);
    renderWindow.addEventListener("keypress", handle);

    return () => {
      unsubscribe();
      renderWindow.removeEventListener("keypress", handle);
    };
  }, [commentSeenEnabled, handle, pym, relayEnvironment, renderWindow]);

  if (amp || toolbarClosed) {
    return null;
  }

  return (
    <MatchMedia lteWidth="mobile">
      <MobileToolbar>
        <Flex justifyContent="space-around" alignItems="center">
          <Button
            variant="filled"
            color="secondary"
            onClick={() =>
              handle(
                JSON.stringify({
                  key: "C",
                  shiftKey: true,
                })
              )
            }
          >
            Shift+C
          </Button>
          <Button
            variant="filled"
            color="secondary"
            onClick={() =>
              handle(
                JSON.stringify({
                  key: "c",
                })
              )
            }
          >
            c
          </Button>
          <Button
            variant="filled"
            color="secondary"
            onClick={() =>
              handle(
                JSON.stringify({
                  key: "z",
                })
              )
            }
          >
            z
          </Button>
          <Button
            variant="filled"
            color="secondary"
            onClick={() => setToolbarClosed(true)}
          >
            Close
          </Button>
        </Flex>
      </MobileToolbar>
    </MatchMedia>
  );
};

export default KeyboardShortcuts;
