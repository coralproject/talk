import { Localized } from "@fluent/react/compat";
import { ListenerFn } from "eventemitter2";
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Environment } from "react-relay";

import { waitFor } from "coral-common/helpers";
import { onPymMessage } from "coral-framework/helpers";
import { useInMemoryState } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { LOCAL_ID } from "coral-framework/lib/relay/localState";
import lookup from "coral-framework/lib/relay/lookup";
import CLASSES from "coral-stream/classes";
import {
  CloseMobileToolbarEvent,
  JumpToNextCommentEvent,
  JumpToNextUnseenCommentEvent,
  JumpToPreviousCommentEvent,
  JumpToPreviousUnseenCommentEvent,
  LoadMoreAllCommentsEvent,
  ShowAllRepliesEvent,
  UnmarkAllEvent,
} from "coral-stream/events";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import parseCommentElementID from "coral-stream/tabs/Comments/Comment/parseCommentElementID";
import {
  CommentSeenContext,
  COMMIT_SEEN_EVENT,
} from "coral-stream/tabs/Comments/commentSeen/CommentSeenContext";
import useZKeyEnabled from "coral-stream/tabs/Comments/commentSeen/useZKeyEnabled";
import useAMP from "coral-stream/tabs/Comments/helpers/useAMP";
import { Button, ButtonIcon, Flex } from "coral-ui/components/v2";
import { MatchMedia } from "coral-ui/components/v2/MatchMedia/MatchMedia";

import MobileToolbar from "./MobileToolbar";
import { SetTraversalFocus } from "./SetTraversalFocus";

import styles from "./KeyboardShortcuts.css";

interface Props {
  loggedIn: boolean;
}

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
  noCircle?: boolean;
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

const shouldDisableUnmarkAll = (window: Window) => {
  return (
    window.document.querySelector<HTMLElement>(
      `.${CLASSES.comment.notSeen}`
    ) === null
  );
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

const getCurrentKeyStop = (window: Window, relayEnvironment: Environment) => {
  const currentCommentID = lookup(relayEnvironment, LOCAL_ID)
    .commentWithTraversalFocus;
  const currentCommentElement = window.document.getElementById(
    computeCommentElementID(currentCommentID)
  );
  if (!currentCommentElement) {
    return null;
  }
  return toKeyStop(currentCommentElement);
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

  if (options.noCircle) {
    return null;
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

  if (options.noCircle) {
    return null;
  }

  // We couldn't find your current element to get the previous one! Go to the
  // first stop.
  return getLastKeyStop(stops, options);
};

const NextUnread = (
  <Localized id="comments-mobileToolbar-nextUnread">
    <span>Next unread</span>
  </Localized>
);

const getNextAction = (
  window: Window,
  relayEnvironment: Environment,
  options: TraverseOptions = {}
) => {
  const currentStop = getCurrentKeyStop(window, relayEnvironment);
  const next = findNextKeyStop(window, currentStop, options);
  if (next) {
    if (next.isLoadMore) {
      return {
        element: NextUnread,
        disabled: Boolean((next.element as HTMLInputElement).disabled),
      };
    } else {
      return {
        element: NextUnread,
        disabled: false,
      };
    }
  }
  return null;
};

// Every time one of these events happen, we update
// the button state.
const eventsOfInterest = [
  "mutation.viewNew",
  "mutation.SetTraversalFocus",
  "subscription.subscribeToCommentEntered.data",
  ShowAllRepliesEvent.nameSuccess,
  LoadMoreAllCommentsEvent.nameSuccess,
  COMMIT_SEEN_EVENT,
];

const KeyboardShortcuts: FunctionComponent<Props> = ({ loggedIn }) => {
  const {
    pym,
    relayEnvironment,
    renderWindow,
    eventEmitter,
    browserInfo,
  } = useCoralContext();
  const [toolbarClosed, setToolbarClosed] = useInMemoryState(
    "keyboardShortcutMobileToolbarClosed",
    false
  );

  const setTraversalFocus = useMutation(SetTraversalFocus);
  const amp = useAMP();
  const zKeyEnabled = useZKeyEnabled();
  const { commitSeen, enabled } = useContext(CommentSeenContext);

  const [nextZAction, setNextZAction] = useState<React.ReactChild | null>(
    NextUnread
  );
  const [disableZAction, setDisableZAction] = useState<boolean>(true);
  const [disableUnmarkAction, setDisableUnmarkAction] = useState<boolean>(true);

  const updateButtonStates = useCallback(() => {
    const nextAction = getNextAction(renderWindow, relayEnvironment, {
      skipSeen: true,
    });
    if (!nextAction) {
      if (!disableZAction) {
        setDisableZAction(true);
      }
      if (!disableUnmarkAction) {
        setDisableUnmarkAction(true);
      }
      return;
    }
    if (nextAction.element !== nextZAction) {
      setNextZAction(nextAction.element);
    }
    if (nextAction.disabled !== disableZAction) {
      setDisableZAction(nextAction.disabled);
    }
    if (shouldDisableUnmarkAll(renderWindow) !== disableUnmarkAction) {
      setDisableUnmarkAction(!disableUnmarkAction);
    }
  }, [
    disableUnmarkAction,
    disableZAction,
    nextZAction,
    relayEnvironment,
    renderWindow,
  ]);

  const unmarkAll = useCallback(
    (config: { source: "keyboard" | "mobileToolbar" }) => {
      UnmarkAllEvent.emit(eventEmitter, { source: config.source });
      commitSeen();
      if (!disableUnmarkAction) {
        setDisableUnmarkAction(true);
      }
    },
    [commitSeen, disableUnmarkAction, eventEmitter]
  );

  const handleUnmarkAllButton = useCallback(() => {
    unmarkAll({ source: "mobileToolbar" });
  }, [unmarkAll]);

  const handleCloseToolbarButton = useCallback(() => {
    setToolbarClosed(true);
    CloseMobileToolbarEvent.emit(eventEmitter);
  }, [eventEmitter, setToolbarClosed]);

  const traverse = useCallback(
    (config: {
      key: "z" | "c";
      reverse: boolean;
      source: "keyboard" | "mobileToolbar";
    }) => {
      if (!pym) {
        return;
      }
      let stop: KeyStop | null = null;
      let traverseOptions: TraverseOptions | undefined;

      if (config.key === "c" || (config.key === "z" && zKeyEnabled)) {
        if (config.key === "z") {
          traverseOptions = {
            skipSeen: true,
          };
        }
        const currentStop = getCurrentKeyStop(renderWindow, relayEnvironment);
        if (config.reverse) {
          stop = findPreviousKeyStop(
            renderWindow,
            currentStop,
            traverseOptions
          );
        } else {
          stop = findNextKeyStop(renderWindow, currentStop, traverseOptions);
        }
      }

      if (!stop) {
        return;
      }

      if (config.key === "c") {
        if (config.reverse) {
          JumpToPreviousCommentEvent.emit(eventEmitter, {
            source: config.source,
          });
        } else {
          JumpToNextCommentEvent.emit(eventEmitter, { source: config.source });
        }
      } else if (config.key === "z") {
        if (config.reverse) {
          JumpToPreviousUnseenCommentEvent.emit(eventEmitter, {
            source: config.source,
          });
        } else {
          JumpToNextUnseenCommentEvent.emit(eventEmitter, {
            source: config.source,
          });
        }
      }

      const offset =
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        renderWindow.document.getElementById(stop.id)!.getBoundingClientRect()
          .top +
        renderWindow.pageYOffset -
        150;
      pym.scrollParentToChildPos(offset);

      if (stop.isLoadMore) {
        let prevOrNextStop = findPreviousKeyStop(renderWindow, stop, {
          skipLoadMore: true,
          noCircle: true,
        });
        if (!prevOrNextStop) {
          prevOrNextStop = findNextKeyStop(renderWindow, stop, {
            skipLoadMore: true,
            noCircle: true,
          });
        }
        if (prevOrNextStop) {
          void setTraversalFocus({
            commentID: parseCommentElementID(prevOrNextStop.id),
            commentSeenEnabled: enabled,
          });
          prevOrNextStop.element.focus();
        }
        stop.element.click();
      } else {
        void setTraversalFocus({
          commentID: parseCommentElementID(stop.id),
          commentSeenEnabled: enabled,
        });
        stop.element.focus();
      }
    },
    [
      enabled,
      eventEmitter,
      pym,
      relayEnvironment,
      renderWindow,
      setTraversalFocus,
      zKeyEnabled,
    ]
  );

  const handleKeypress = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent | string) => {
      if (!pym) {
        return;
      }

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
            if (el.isContentEditable) {
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

      const pressedKey = data.key.toLocaleLowerCase();
      if (pressedKey === "a" && data.shiftKey) {
        unmarkAll({ source: "keyboard" });
        return;
      }

      if (pressedKey === "c" || (pressedKey === "z" && zKeyEnabled)) {
        traverse({
          key: pressedKey,
          reverse: Boolean(data.shiftKey),
          source: "keyboard",
        });
      }
    },
    [pym, traverse, unmarkAll, zKeyEnabled]
  );

  const handleZKeyButton = useCallback(
    () => traverse({ key: "z", reverse: false, source: "mobileToolbar" }),
    [traverse]
  );

  // Update button states after first render.
  useEffect(() => {
    updateButtonStates();
  }, [updateButtonStates]);

  // Update button states after certain events.
  useEffect(() => {
    const listener: ListenerFn = async (e) => {
      if (!eventsOfInterest.includes(e)) {
        return;
      }

      // Wait until current renderpass finishes.
      // TODO: (cvle) revisit whenever we do async rendering.
      await waitFor(50);
      updateButtonStates();
    };
    eventEmitter.onAny(listener);
    return () => {
      eventEmitter.offAny(listener);
    };
  }, [eventEmitter, updateButtonStates]);

  // Subscribe to keypress events.
  useEffect(() => {
    if (!pym) {
      return;
    }

    const unsubscribe = onPymMessage(pym, "keypress", handleKeypress);
    renderWindow.addEventListener("keypress", handleKeypress);

    return () => {
      unsubscribe();
      renderWindow.removeEventListener("keypress", handleKeypress);
    };
  }, [handleKeypress, pym, renderWindow]);

  if (amp || toolbarClosed || !zKeyEnabled || !loggedIn) {
    return null;
  }

  return (
    <MatchMedia lteDeviceWidth="mobileMax">
      {(matches) =>
        (matches ||
          browserInfo.mobile ||
          browserInfo.tablet ||
          browserInfo.iPadOS) && (
          <MobileToolbar onKeyPress={handleKeypress}>
            <Flex className={styles.flexContainer} alignItems="center">
              <div className={styles.unmarkAllContainer}>
                <Button
                  variant="text"
                  size="large"
                  uppercase={false}
                  disabled={disableUnmarkAction}
                  onClick={handleUnmarkAllButton}
                  classes={{
                    variantText: styles.button,
                    disabled: styles.buttonDisabled,
                    colorRegular: styles.buttonColor,
                  }}
                >
                  <ButtonIcon>done_all</ButtonIcon>
                  <Localized id="comments-mobileToolbar-unmarkAll">
                    <span>Unmark all</span>
                  </Localized>
                </Button>
              </div>
              <div className={styles.nextActionContainer}>
                <Button
                  variant="text"
                  size="large"
                  uppercase={false}
                  disabled={disableZAction}
                  classes={{
                    variantText: styles.button,
                    disabled: styles.buttonDisabled,
                    colorRegular: styles.buttonColor,
                  }}
                  onClick={handleZKeyButton}
                >
                  {nextZAction}
                  <ButtonIcon>skip_next</ButtonIcon>
                </Button>
              </div>
              <div className={styles.closeContainer}>
                <Localized
                  id="comments-mobileToolbar-closeButton"
                  attrs={{ "aria-label": true }}
                >
                  <Button
                    variant="text"
                    size="large"
                    uppercase={false}
                    classes={{
                      variantText: styles.button,
                      disabled: styles.buttonDisabled,
                      colorRegular: styles.buttonColor,
                    }}
                    onClick={handleCloseToolbarButton}
                    aria-label="Close"
                  >
                    <ButtonIcon>close</ButtonIcon>
                  </Button>
                </Localized>
              </div>
            </Flex>
          </MobileToolbar>
        )
      }
    </MatchMedia>
  );
};

export default KeyboardShortcuts;
