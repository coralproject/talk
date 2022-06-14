import { Localized } from "@fluent/react/compat";
import { ListenerFn } from "eventemitter2";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Environment, graphql } from "react-relay";

import { useInMemoryState } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { LOCAL_ID } from "coral-framework/lib/relay/localState";
import lookup from "coral-framework/lib/relay/lookup";
import isElementIntersecting from "coral-framework/utils/isElementIntersecting";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
import {
  CloseMobileToolbarEvent,
  JumpToNextCommentEvent,
  JumpToNextUnseenCommentEvent,
  JumpToPreviousCommentEvent,
  JumpToPreviousUnseenCommentEvent,
  ShowAllRepliesEvent,
  UnmarkAllEvent,
  ViewNewRepliesNetworkEvent,
} from "coral-stream/events";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import MarkCommentsAsSeenMutation from "coral-stream/tabs/Comments/Comment/MarkCommentsAsSeenMutation";
import parseCommentElementID from "coral-stream/tabs/Comments/Comment/parseCommentElementID";
import { useCommentSeenEnabled } from "coral-stream/tabs/Comments/commentSeen/";
import useZKeyEnabled from "coral-stream/tabs/Comments/commentSeen/useZKeyEnabled";
import useAMP from "coral-stream/tabs/Comments/helpers/useAMP";
import { NextUnseenComment } from "coral-stream/tabs/Comments/Stream/AllCommentsTab/AllCommentsTabVirtualizedComments";
import { Button, ButtonIcon, Flex } from "coral-ui/components/v2";
import { MatchMedia } from "coral-ui/components/v2/MatchMedia/MatchMedia";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { KeyboardShortcuts_local } from "coral-stream/__generated__/KeyboardShortcuts_local.graphql";

import scrollToBeginning from "../scrollToBeginning";
import MobileToolbar from "./MobileToolbar";
import { SetTraversalFocus } from "./SetTraversalFocus";

import styles from "./KeyboardShortcuts.css";

interface Props {
  loggedIn: boolean;
  storyID: string;
  currentScrollRef: any;
  nextUnseenComment: NextUnseenComment | null;
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
  skipNonLoadMoreOrViewNew?: boolean;
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
  if (
    options.skipNonLoadMoreOrViewNew &&
    !(stop.isLoadMore || stop.isViewNew)
  ) {
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
  options: TraverseOptions = {},
  currentScrollRef?: any
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
  if (currentScrollRef) {
    currentScrollRef.current.scrollIntoView({
      align: "center",
      index: 0,
      behavior: "auto",
      done: () => {
        setTimeout(() => {
          const newStops = getKeyStops(root);
          const firstKeyStop = getFirstKeyStop(newStops, options);
          if (firstKeyStop) {
            firstKeyStop.element.focus();
          }
        }, 0);
      },
    });
    return null;
  }
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

const loadMoreRepliesEvents = [
  ShowAllRepliesEvent.nameSuccess,
  ViewNewRepliesNetworkEvent.nameSuccess,
];

const KeyboardShortcuts: FunctionComponent<Props> = ({
  loggedIn,
  storyID,
  currentScrollRef,
  nextUnseenComment,
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
  const [, setLocal] = useLocal<KeyboardShortcuts_local>(graphql`
    fragment KeyboardShortcuts_local on Local {
      commentWithTraversalFocus
      keyboardShortcutsConfig {
        key
        source
        reverse
      }
      loadAllReplies
      zKeyClickedLoadAll
    }
  `);
  const amp = useAMP();
  const zKeyEnabled = useZKeyEnabled();
  const commentSeenEnabled = useCommentSeenEnabled();

  const [disableUnreadButtons, setDisableUnreadButtons] = useState<boolean>(
    true
  );

  const updateButtonStates = useCallback(() => {
    if (!nextUnseenComment) {
      if (!disableUnreadButtons) {
        setDisableUnreadButtons(true);
      }
    } else {
      if (disableUnreadButtons) {
        setDisableUnreadButtons(false);
      }
    }
  }, [disableUnreadButtons, nextUnseenComment]);

  const unmarkAll = useCallback(
    (config: { source: "keyboard" | "mobileToolbar" }) => {
      UnmarkAllEvent.emit(eventEmitter, { source: config.source });
      void markSeen({
        storyID,
        commentIDs: [],
        updateSeen: true,
        markAllAsSeen: true,
      });
      if (!disableUnreadButtons) {
        setDisableUnreadButtons(true);
      }
    },
    [disableUnreadButtons, eventEmitter, markSeen, storyID]
  );

  const handleUnmarkAllButton = useCallback(() => {
    unmarkAll({ source: "mobileToolbar" });
  }, [unmarkAll]);

  const handleCloseToolbarButton = useCallback(() => {
    setToolbarClosed(true);
    CloseMobileToolbarEvent.emit(eventEmitter);
  }, [eventEmitter, setToolbarClosed]);

  // Traverse is used for C key traversal and for Z key traversal after more replies
  // are loaded in and those events are successfully triggered (to navigate to the next unseen
  // new reply after where the Load / View more buttons were).
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
          stop = findNextKeyStop(
            root,
            currentStop,
            traverseOptions,
            currentScrollRef
          );
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
      currentScrollRef,
    ]
  );

  const setFocusAndMarkSeen = useCallback(
    (commentID: string) => {
      void setTraversalFocus({
        commentID,
        commentSeenEnabled,
      });
      void markSeen({
        storyID,
        commentIDs: [commentID],
        updateSeen: true,
      });
    },
    [setTraversalFocus, markSeen, commentSeenEnabled, storyID]
  );

  const scrollToComment = useCallback(
    (comment) => {
      const offset =
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        comment.getBoundingClientRect().top + renderWindow.pageYOffset - 150;
      setTimeout(() => renderWindow.scrollTo({ top: offset }), 0);
    },
    [renderWindow]
  );

  // If the next unseen comment is a reply, then this finds that comment beneath
  // its Virtuoso index root comment. If the next unseen is behind a Show more or
  // View new comments button, then this clicks that button and loads in the needed
  // replies. Once the comment is found, focus is set and the comment is marked as seen.
  const findCommentAndSetFocus = useCallback(
    (nextUnseen, isRootComment, rootCommentElement) => {
      // If next unseen is a root comment, we can just scroll to it, set focus, and
      // mark it as seen.
      if (isRootComment) {
        scrollToComment(rootCommentElement);
        setFocusAndMarkSeen(nextUnseen.commentID!);
      } else {
        const nextUnseenReply = root.getElementById(
          computeCommentElementID(nextUnseen.commentID!)
        );

        // Once root comment is available, check to see if the next unseen
        // reply comment is found already in the DOM.
        // If so, we scroll to it, set focus, and mark as seen.
        if (nextUnseenReply) {
          scrollToComment(nextUnseenReply);
          setFocusAndMarkSeen(nextUnseen.commentID!);
          // If the next unseen reply comment is not found in the DOM, that means
          // we need to load more comments to find it.
        } else {
          const rootKeyStop = toKeyStop(rootCommentElement);

          // Find the next Load more button or View new replies button.
          const nextLoadMoreOrViewNewKeyStop = findNextKeyStop(
            root,
            rootKeyStop,
            {
              skipNonLoadMoreOrViewNew: true,
            }
          );
          if (nextLoadMoreOrViewNewKeyStop) {
            const prevStop = findPreviousKeyStop(
              root,
              nextLoadMoreOrViewNewKeyStop,
              {
                skipLoadMore: true,
              }
            );

            // Set focus to the comment before the Load/View more button
            // while more replies are being loaded in.
            if (prevStop) {
              setFocusAndMarkSeen(parseCommentElementID(prevStop.id));
            }

            // We have to set load all replies to the comment id to load
            // more replies for to make sure that we load after Virtuoso has
            // remounted the reply list component after scrolling.
            // New replies are actually loaded by ReplyListContainer, and then
            // the next unseen reply is traversed to after the success of the
            // Load More replies or View New replies events.
            if (nextLoadMoreOrViewNewKeyStop.isViewNew) {
              setTimeout(
                () =>
                  setLocal({
                    loadAllReplies: nextLoadMoreOrViewNewKeyStop.id.substr(42),
                  }),
                0
              );
            } else {
              setTimeout(
                () =>
                  setLocal({
                    loadAllReplies: nextLoadMoreOrViewNewKeyStop.id.substr(34),
                  }),
                0
              );
            }
          }
        }
      }
    },
    [root, setFocusAndMarkSeen, setLocal, scrollToComment]
  );

  const handleZKeyPress = useCallback(
    async (source: "keyboard" | "mobileToolbar") => {
      // If a Load all comments button is currently displayed, but the next
      // unseen comment is at a Virtuoso index greater than the initial number
      // of comments we display, we need to hide the button and show those comments
      // so we can scroll to that next unseen.
      if (
        nextUnseenComment &&
        nextUnseenComment.index &&
        nextUnseenComment.index >= NUM_INITIAL_COMMENTS
      ) {
        setLocal({ zKeyClickedLoadAll: true });
      }
      // If we need to load new comments that entered via subscription,
      // we scroll to the top of the comments, click the view new comments
      // button, and then set focus and mark as seen the next unseen comment.
      if (nextUnseenComment?.needToLoadNew) {
        scrollToBeginning(root, renderWindow);
        const viewNewCommentsButton = root.getElementById(
          "comments-allComments-viewNewButton"
        );
        if (viewNewCommentsButton) {
          viewNewCommentsButton.click();
          setFocusAndMarkSeen(nextUnseenComment.commentID!);
        }
      }

      const isRootComment =
        nextUnseenComment?.commentID === nextUnseenComment?.rootCommentID;

      // Scroll to the Virtuoso index for the next unseen comment!
      // (unless we are already on that index, then don't scroll again)
      // Then find the next unseen comment and set traversal focus to it.
      if (
        nextUnseenComment &&
        nextUnseenComment.commentID &&
        nextUnseenComment.rootCommentID &&
        (nextUnseenComment.index || nextUnseenComment.index === 0)
      ) {
        JumpToNextUnseenCommentEvent.emit(eventEmitter, {
          source,
        });
        // Check if next unseen comment is already loaded up in virtuoso.
        // if it is, we can just find the comment, scroll to it, set focus to it,
        // and mark it as seen.
        const nextUnseenInRoot = root.getElementById(
          computeCommentElementID(nextUnseenComment.rootCommentID)
        );
        if (nextUnseenInRoot) {
          findCommentAndSetFocus(
            nextUnseenComment,
            isRootComment,
            nextUnseenInRoot
          );
        } else {
          currentScrollRef.current.scrollIntoView({
            align: "center",
            index: nextUnseenComment.index,
            behavior: "auto",
            done: () => {
              // After Virtuoso scrolls, we have to make sure the root comment
              // is available before setting focus to it or one of its replies.
              let count = 0;
              const rootCommentElementExists = setInterval(async () => {
                count += 1;
                const rootCommentElement = root.getElementById(
                  computeCommentElementID(nextUnseenComment.rootCommentID!)
                );
                if (
                  rootCommentElement !== undefined &&
                  rootCommentElement !== null
                ) {
                  clearInterval(rootCommentElementExists);
                  if (rootCommentElement) {
                    // Once we've found the root comment element in the DOM,
                    // we can find the next unseen comment, scroll to it, set focus,
                    // and mark it as seen.
                    findCommentAndSetFocus(
                      nextUnseenComment,
                      isRootComment,
                      rootCommentElement
                    );
                  }
                }
                if (count > 10) {
                  clearInterval(rootCommentElementExists);
                }
              }, 100);
            },
          });
        }
      }
    },
    [
      root,
      renderWindow,
      eventEmitter,
      findCommentAndSetFocus,
      nextUnseenComment,
      currentScrollRef,
      setFocusAndMarkSeen,
      setLocal,
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
            reverse: false,
            source: "keyboard",
          },
        });
        void handleZKeyPress("keyboard");
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
    void handleZKeyPress("mobileToolbar");
  }, [setLocal, handleZKeyPress]);

  // Update button states after first render and
  // whenever the next unseen comment updates.
  useEffect(() => {
    updateButtonStates();
  }, [nextUnseenComment, updateButtonStates]);

  // Traverse to next comment/reply after loading more/new comments and replies
  useEffect(() => {
    const listener: ListenerFn = async (e, data) => {
      if (loadMoreRepliesEvents.includes(e)) {
        // Announce height change to embed to allow
        // immediately updating amp iframe height
        // instead of waiting for polling to update it
        eventEmitter.emit("heightChange");

        // After more replies have loaded, we traverse
        // to the next reply based on the configuration.
        // Focus has already been set to the comment/reply that is directly
        // before the next unseen that we want to end up on.
        if (data.keyboardShortcutsConfig) {
          traverse(data.keyboardShortcutsConfig);
        }
      }
    };
    eventEmitter.onAny(listener);
    return () => {
      eventEmitter.offAny(listener);
    };
  }, [eventEmitter, traverse, commentSeenEnabled]);

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
                  disabled={disableUnreadButtons}
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
                  disabled={disableUnreadButtons}
                  classes={{
                    variantText: styles.button,
                    disabled: styles.buttonDisabled,
                    colorRegular: styles.buttonColor,
                  }}
                  onClick={handleZKeyButton}
                >
                  <Localized id="comments-mobileToolbar-nextUnread">
                    <span>Next unread</span>
                  </Localized>
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
