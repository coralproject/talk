import { Localized } from "@fluent/react/compat";
import { ListenerFn } from "eventemitter2";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Environment, graphql } from "react-relay";

import { waitFor } from "coral-common/helpers";
import { useInMemoryState } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { LOCAL_ID } from "coral-framework/lib/relay/localState";
import lookup from "coral-framework/lib/relay/lookup";
import isElementIntersecting from "coral-framework/utils/isElementIntersecting";
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
  ViewNewCommentsNetworkEvent,
} from "coral-stream/events";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import MarkCommentsAsSeenMutation from "coral-stream/tabs/Comments/Comment/MarkCommentsAsSeenMutation";
import parseCommentElementID from "coral-stream/tabs/Comments/Comment/parseCommentElementID";
import {
  COMMIT_SEEN_EVENT,
  useCommentSeenEnabled,
} from "coral-stream/tabs/Comments/commentSeen/";
import useZKeyEnabled from "coral-stream/tabs/Comments/commentSeen/useZKeyEnabled";
import useAMP from "coral-stream/tabs/Comments/helpers/useAMP";
import { Button, ButtonIcon, Flex } from "coral-ui/components/v2";
import { MatchMedia } from "coral-ui/components/v2/MatchMedia/MatchMedia";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { KeyboardShortcuts_local } from "coral-stream/__generated__/KeyboardShortcuts_local.graphql";

import MobileToolbar from "./MobileToolbar";
import { SetTraversalFocus } from "./SetTraversalFocus";

import styles from "./KeyboardShortcuts.css";

interface Props {
  loggedIn: boolean;
  storyID: string;
  currentScrollRef: any;
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
  isViewNew: boolean;
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
    isViewNew: "isViewNew" in element.dataset,
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

const getKeyStops = (root: ShadowRoot | Document) => {
  const stops: KeyStop[] = [];
  root
    .querySelectorAll<HTMLElement>("[data-key-stop]")
    .forEach((el) => stops.push(toKeyStop(el)));
  return stops;
};

const shouldDisableUnmarkAll = (root: ShadowRoot | Document) => {
  return (
    root.querySelector<HTMLElement>(`.${CLASSES.comment.notSeen}`) === null
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

const getCurrentKeyStop = (
  root: ShadowRoot | Document,
  relayEnvironment: Environment
) => {
  const currentCommentID = lookup(relayEnvironment, LOCAL_ID)
    .commentWithTraversalFocus;
  const currentCommentElement = root.getElementById(
    computeCommentElementID(currentCommentID)
  );
  if (!currentCommentElement) {
    return null;
  }
  return toKeyStop(currentCommentElement);
};

const findNextKeyStop = (
  root: ShadowRoot | Document,
  currentStop: KeyStop | null,
  options: TraverseOptions = {}
): KeyStop | null => {
  const stops = getKeyStops(root);
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
  root: ShadowRoot | Document,
  currentStop: KeyStop | null,
  options: TraverseOptions = {}
): KeyStop | null => {
  const stops = getKeyStops(root);
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
  root: ShadowRoot | Document,
  relayEnvironment: Environment,
  options: TraverseOptions = {}
) => {
  const currentStop = getCurrentKeyStop(root, relayEnvironment);
  const next = findNextKeyStop(root, currentStop, options);
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
  ViewNewCommentsNetworkEvent.nameSuccess,
  COMMIT_SEEN_EVENT,
];

const KeyboardShortcuts: FunctionComponent<Props> = ({
  loggedIn,
  storyID,
  currentScrollRef,
}) => {
  const {
    relayEnvironment,
    renderWindow,
    eventEmitter,
    browserInfo,
  } = useCoralContext();
  const root = useShadowRootOrDocument();
  const [toolbarClosed, setToolbarClosed] = useInMemoryState(
    "keyboardShortcutMobileToolbarClosed",
    false
  );

  const setTraversalFocus = useMutation(SetTraversalFocus);
  const markSeen = useMutation(MarkCommentsAsSeenMutation);
  const [local, setLocal] = useLocal<KeyboardShortcuts_local>(graphql`
    fragment KeyboardShortcuts_local on Local {
      commentWithTraversalFocus
      keyboardShortcutsConfig {
        key
        source
        reverse
      }
      firstNextUnseenComment {
        nodeID
        isRoot
        virtuosoIndex
      }
      secondNextUnseenComment {
        nodeID
        isRoot
        virtuosoIndex
      }
      loadAllReplies
    }
  `);
  const amp = useAMP();
  const zKeyEnabled = useZKeyEnabled();
  const commentSeenEnabled = useCommentSeenEnabled();

  const [nextZAction, setNextZAction] = useState<React.ReactChild | null>(
    NextUnread
  );
  const [disableZAction, setDisableZAction] = useState<boolean>(true);
  const [disableUnmarkAction, setDisableUnmarkAction] = useState<boolean>(true);

  const updateButtonStates = useCallback(() => {
    const nextAction = getNextAction(root, relayEnvironment, {
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
    if (shouldDisableUnmarkAll(root) !== disableUnmarkAction) {
      setDisableUnmarkAction(!disableUnmarkAction);
    }
  }, [
    disableUnmarkAction,
    disableZAction,
    nextZAction,
    relayEnvironment,
    root,
  ]);

  const unmarkAll = useCallback(
    (config: { source: "keyboard" | "mobileToolbar" }) => {
      UnmarkAllEvent.emit(eventEmitter, { source: config.source });

      // eslint-disable-next-line no-restricted-globals
      const notSeenComments = window.document.querySelectorAll<HTMLElement>(
        "[data-not-seen=true]"
      );
      const commentIDs: string[] = [];
      notSeenComments.forEach((c) => {
        const id = c.getAttribute("id")?.replace("comment-", "");
        if (id) {
          commentIDs.push(id);
        }
      });

      void markSeen({ storyID, commentIDs });
      if (!disableUnmarkAction) {
        setDisableUnmarkAction(true);
      }
    },
    [disableUnmarkAction, eventEmitter, markSeen, storyID]
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
      let stop: KeyStop | null = null;
      let traverseOptions: TraverseOptions | undefined;

      if (config.key === "c" || (config.key === "z" && zKeyEnabled)) {
        if (config.key === "z") {
          traverseOptions = {
            skipSeen: true,
          };
        }
        const currentStop = getCurrentKeyStop(root, relayEnvironment);

        if (config.reverse) {
          stop = findPreviousKeyStop(root, currentStop, traverseOptions);
        } else {
          stop = findNextKeyStop(root, currentStop, traverseOptions);
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
        root.getElementById(stop.id)!.getBoundingClientRect().top +
        renderWindow.pageYOffset -
        150;
      renderWindow.scrollTo({ top: offset });

      if (stop.isLoadMore) {
        if (!stop.isViewNew) {
          let prevOrNextStop = findPreviousKeyStop(root, stop, {
            skipLoadMore: true,
            noCircle: true,
          });
          if (!prevOrNextStop) {
            prevOrNextStop = findNextKeyStop(root, stop, {
              skipLoadMore: true,
              noCircle: true,
            });
          }
          if (prevOrNextStop) {
            void setTraversalFocus({
              commentID: parseCommentElementID(prevOrNextStop.id),
              commentSeenEnabled,
            });
            prevOrNextStop.element.focus();
          }
        }
        stop.element.click();
      } else {
        void setTraversalFocus({
          commentID: parseCommentElementID(stop.id),
          commentSeenEnabled,
        });
        stop.element.focus();
      }
    },
    [
      commentSeenEnabled,
      eventEmitter,
      relayEnvironment,
      root,
      renderWindow,
      setTraversalFocus,
      zKeyEnabled,
    ]
  );

  const setFocus = useCallback(
    (
      commentToScrollTo: {
        isRoot: boolean;
        nodeID: string;
        virtuosoIndex: number;
      },
      source: "keyboard" | "mobileToolbar"
    ) => {
      if (commentToScrollTo.isRoot) {
        void setTraversalFocus({
          commentID: commentToScrollTo.nodeID,
          commentSeenEnabled,
        });
        void markSeen({
          storyID,
          commentIDs: [commentToScrollTo.nodeID],
        });
      } else {
        let count = 0;
        // after Virtuoso scrolls, we have to make sure the root comment
        // is available before setting focus to the next unseen comment
        const rootCommentElementExists = setInterval(async () => {
          count += 1;
          const rootCommentElement = root.getElementById(
            computeCommentElementID(commentToScrollTo.nodeID)
          );
          if (rootCommentElement !== undefined && rootCommentElement !== null) {
            clearInterval(rootCommentElementExists);
            if (rootCommentElement) {
              const rootKeyStop = toKeyStop(rootCommentElement);
              const nextKeyStop = findNextKeyStop(root, rootKeyStop, {
                skipSeen: true,
              });

              if (nextKeyStop) {
                // if there are no unseen comments before the next show all replies
                // button, load all replies (traversal to next unseen comment will
                // be handled after the success event for all replies loading)
                if (nextKeyStop.isLoadMore) {
                  const prevStop = findPreviousKeyStop(root, nextKeyStop, {
                    skipLoadMore: true,
                  });
                  if (prevStop) {
                    void setTraversalFocus({
                      commentID: parseCommentElementID(prevStop.id),
                      commentSeenEnabled,
                    });
                    prevStop.element.focus();
                  }
                  // We have to set load all replies to the comment id to load
                  // more replies for to make sure that we load after Virtuoso has
                  // remounted the reply list component after scrolling
                  setLocal({ loadAllReplies: nextKeyStop.id.substr(34) });
                } else {
                  // go to the first unseen reply to the root comment and set focus to it
                  JumpToNextUnseenCommentEvent.emit(eventEmitter, {
                    source,
                  });
                  const offset =
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    root.getElementById(nextKeyStop.id)!.getBoundingClientRect()
                      .top +
                    renderWindow.pageYOffset -
                    150;
                  setTimeout(() => renderWindow.scrollTo({ top: offset }), 0);
                  void setTraversalFocus({
                    commentID: parseCommentElementID(nextKeyStop.id),
                    commentSeenEnabled,
                  });
                  nextKeyStop.element.focus();
                }
              }
            }
          }
          if (count > 10) {
            clearInterval(rootCommentElementExists);
          }
        }, 100);
      }
    },
    [
      commentSeenEnabled,
      markSeen,
      renderWindow,
      root,
      setTraversalFocus,
      storyID,
      eventEmitter,
      setLocal,
    ]
  );

  const handleZKeyPress = useCallback(
    (source: "keyboard" | "mobileToolbar") => {
      let viewNewCommentButtonFound = false;
      if (!local.commentWithTraversalFocus) {
        // Check here for View new comment and click to open
        // and reveal new comment if it exists.
        // The new comment can only be first chronologically if
        // no comment already has traversal focus.
        // Traversing to the first new unseen comment will be handled
        // after the success event for the new comment being loaded.
        const viewNewCommentsButton = root.getElementById(
          "comments-allComments-viewNewButton"
        );
        if (viewNewCommentsButton) {
          viewNewCommentsButton.click();
          viewNewCommentButtonFound = true;
        }
      }
      // If we don't find a new comment, then we go to first unseen comment
      // if it exists
      if (local.firstNextUnseenComment && !viewNewCommentButtonFound) {
        // Check for a Load All Comments button and click it first before scrolling
        // (only if virtuoso index is greater than 20/the default number of first comments)
        if (local.firstNextUnseenComment.virtuosoIndex >= 20) {
          const loadAllCommentsButton = root.getElementById(
            "comments-loadMore"
          );
          if (loadAllCommentsButton) {
            loadAllCommentsButton.click();
          }
        }
        // first, we check if there is a current commentWithTraversalFocus
        // if not, we scroll to first virtuoso index and set focus
        if (!local.commentWithTraversalFocus) {
          currentScrollRef.current.scrollIntoView({
            align: "center",
            index: local.firstNextUnseenComment.virtuosoIndex,
            behavior: "auto",
            done: () => {
              setFocus(local.firstNextUnseenComment!, source);
            },
          });
        } else {
          // if there is a current commentWithTraversal focus, we first attempt to
          // find a next unseen comment that's already loaded without any scrolling
          const currentCommentID = local.commentWithTraversalFocus;
          let currentCommentElement;
          if (currentCommentID) {
            currentCommentElement = root.getElementById(
              computeCommentElementID(currentCommentID)
            );
          }
          let currentStop;
          if (currentCommentElement) {
            currentStop = toKeyStop(currentCommentElement);
          }
          let nextStop;
          if (currentStop) {
            nextStop = findNextKeyStop(root, currentStop, {
              skipSeen: true,
            });
          }
          // If a next unseen comment is found without scrolling, we either set it
          // to traversal focus or click if it's a load more
          if (nextStop) {
            const offset =
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              root.getElementById(nextStop.id)!.getBoundingClientRect().top +
              renderWindow.pageYOffset -
              150;
            renderWindow.scrollTo({ top: offset });
            if (nextStop.isLoadMore) {
              nextStop.element.click();
            } else {
              JumpToNextUnseenCommentEvent.emit(eventEmitter, {
                source,
              });
              void setTraversalFocus({
                commentID: parseCommentElementID(nextStop.id),
                commentSeenEnabled,
              });
              nextStop.element.focus();
            }
            // If a next unseen comment isn't found without scrolling, we
            // check which virtuoso index to scroll to and then scroll and set focus
          } else {
            const currentVirtuosoIndex = currentCommentElement
              ?.closest("[data-index]")
              ?.getAttribute("data-index");
            // We scroll to the second virtuoso index if the currently scrolled Virtuoso
            // index that we just checked is the same Virtuoso index as the first unseen
            // comment that was found
            const useSecondIndex =
              currentVirtuosoIndex ===
              local.firstNextUnseenComment.virtuosoIndex.toString();
            const commentToScrollTo = useSecondIndex
              ? local.secondNextUnseenComment
              : local.firstNextUnseenComment;
            if (commentToScrollTo) {
              currentScrollRef.current.scrollIntoView({
                align: "center",
                index: commentToScrollTo.virtuosoIndex,
                behavior: "auto",
                done: () => {
                  setFocus(commentToScrollTo, source);
                },
              });
            }
          }
        }
      }
    },
    [
      root,
      currentScrollRef,
      setFocus,
      eventEmitter,
      local,
      renderWindow,
      setTraversalFocus,
      commentSeenEnabled,
    ]
  );

  const handleKeypress = useCallback(
    async (event: React.KeyboardEvent | KeyboardEvent | string) => {
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

      // Ignore when we are not intersecting.
      if ("host" in root && !isElementIntersecting(root.host, renderWindow)) {
        return;
      }

      const pressedKey = data.key.toLocaleLowerCase();
      if (pressedKey === "a" && data.shiftKey) {
        unmarkAll({ source: "keyboard" });
        return;
      }

      if (pressedKey === "c") {
        setLocal({
          keyboardShortcutsConfig: {
            key: pressedKey,
            reverse: Boolean(data.shiftKey),
            source: "keyboard",
          },
        });
        traverse({
          key: pressedKey,
          reverse: Boolean(data.shiftKey),
          source: "keyboard",
        });
      }
      if (pressedKey === "z" && zKeyEnabled) {
        setLocal({
          keyboardShortcutsConfig: {
            key: pressedKey,
            reverse: Boolean(data.shiftKey),
            source: "keyboard",
          },
        });
        handleZKeyPress("keyboard");
      }
    },
    [
      renderWindow,
      root,
      setLocal,
      traverse,
      unmarkAll,
      zKeyEnabled,
      handleZKeyPress,
    ]
  );

  const handleWindowKeypress = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      // Ignore events inside shadow dom.
      if ("host" in root) {
        if (event.target === root.host) {
          return;
        }
      }
      return handleKeypress(event);
    },
    [handleKeypress, root]
  );

  const handleZKeyButton = useCallback(() => {
    setLocal({
      keyboardShortcutsConfig: {
        key: "z",
        reverse: false,
        source: "mobileToolbar",
      },
    });
    handleZKeyPress("mobileToolbar");
  }, [setLocal, handleZKeyPress]);

  // Update button states after first render.
  useEffect(() => {
    updateButtonStates();
  }, [updateButtonStates]);

  // Update button states after certain events.
  // Also traverse to next comment/reply after loading new comments and replies
  useEffect(() => {
    const listener: ListenerFn = async (e, data) => {
      if (!eventsOfInterest.includes(e)) {
        return;
      }

      if (e === ShowAllRepliesEvent.nameSuccess) {
        // Announce height change to embed to allow
        // immediately updating amp iframe height
        // instead of waiting for polling to update it
        eventEmitter.emit("heightChange");
        // after more replies have loaded, we want to traverse
        // to the next reply based on the configuration
        if (data.keyboardShortcutsConfig) {
          traverse(data.keyboardShortcutsConfig);
        }
      }

      if (e === ViewNewCommentsNetworkEvent.nameSuccess) {
        // Announce height change to embed to allow
        // immediately updating amp iframe height
        // instead of waiting for polling to update it
        eventEmitter.emit("heightChange");
        // after new comment(s) have loaded, we want to traverse
        // to the first comment based on the configuration
        if (
          data.keyboardShortcutsConfig &&
          data.keyboardShortcutsConfig.key === "z"
        ) {
          const stops = getKeyStops(root);
          const firstStop = getFirstKeyStop(stops);
          if (firstStop) {
            void setTraversalFocus({
              commentID: parseCommentElementID(firstStop.id),
              commentSeenEnabled,
            });
            firstStop.element.focus();
          }
        }
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
  }, [eventEmitter, traverse, updateButtonStates, root]);

  // Subscribe to keypress events.
  useEffect(() => {
    renderWindow.addEventListener("keypress", handleWindowKeypress);
    root.addEventListener("keypress", handleKeypress as any);

    return () => {
      renderWindow.removeEventListener("keypress", handleWindowKeypress);
      root.removeEventListener("keypress", handleKeypress as any);
    };
  }, [handleKeypress, handleWindowKeypress, renderWindow, root]);

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
