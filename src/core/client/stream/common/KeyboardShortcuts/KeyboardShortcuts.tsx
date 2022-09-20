import { Localized } from "@fluent/react/compat";
import { ListenerFn } from "eventemitter2";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Environment, graphql } from "react-relay";

import { useInMemoryState } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { LOCAL_ID } from "coral-framework/lib/relay/localState";
import lookup from "coral-framework/lib/relay/lookup";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import isElementIntersecting from "coral-framework/utils/isElementIntersecting";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
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
  ViewNewRepliesNetworkEvent,
} from "coral-stream/events";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import MarkCommentsAsSeenMutation from "coral-stream/tabs/Comments/Comment/MarkCommentsAsSeenMutation";
import parseCommentElementID from "coral-stream/tabs/Comments/Comment/parseCommentElementID";
import { useCommentSeenEnabled } from "coral-stream/tabs/Comments/commentSeen/";
import useZKeyEnabled from "coral-stream/tabs/Comments/commentSeen/useZKeyEnabled";
import useAMP from "coral-stream/tabs/Comments/helpers/useAMP";
import { Button, ButtonIcon, Flex } from "coral-ui/components/v2";
import { MatchMedia } from "coral-ui/components/v2/MatchMedia/MatchMedia";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { KeyboardShortcuts_local } from "coral-stream/__generated__/KeyboardShortcuts_local.graphql";

import MobileToolbar from "./MobileToolbar";
import { SetTraversalFocus } from "./SetTraversalFocus";

import styles from "./KeyboardShortcuts.css";

interface ChildComment {
  readonly node: {
    readonly seen: boolean | null;
    readonly id: string;
    readonly ancestorIDs: ReadonlyArray<string | null>;
    readonly deleted: boolean | null;
  };
}

interface Comment {
  readonly node: {
    readonly seen: boolean | null;
    readonly id: string;
    readonly allChildComments: {
      readonly edges: ReadonlyArray<ChildComment>;
    };
    readonly deleted: boolean | null;
    ignored?: boolean | null;
    ignoredReplies?: string[];
  };
}

interface Props {
  storyID: string;
  currentScrollRef: any;
  comments: ReadonlyArray<Comment>;
  viewNewCount: number;
  hasMore: boolean;
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

interface UnseenComment {
  isRoot: boolean;
  nodeID?: string;
  virtuosoIndex?: number;
  rootCommentID?: string;
  isNew?: boolean;
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
  const currentCommentID = lookup(
    relayEnvironment,
    LOCAL_ID
  ).commentWithTraversalFocus;
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

const loadMoreEvents = [
  ShowAllRepliesEvent.nameSuccess,
  ViewNewRepliesNetworkEvent.nameSuccess,
  LoadMoreAllCommentsEvent.nameSuccess,
  ViewNewCommentsNetworkEvent.nameSuccess,
];

const KeyboardShortcuts: FunctionComponent<Props> = ({
  storyID,
  currentScrollRef,
  comments,
  viewNewCount,
  hasMore,
}) => {
  const {
    relayEnvironment,
    renderWindow,
    eventEmitter,
    browserInfo,
    customScrollContainer,
  } = useCoralContext();

  const root = useShadowRootOrDocument();
  const [toolbarClosed, setToolbarClosed] = useInMemoryState(
    "keyboardShortcutMobileToolbarClosed",
    false
  );

  const setTraversalFocus = useMutation(SetTraversalFocus);
  const markSeen = useMutation(MarkCommentsAsSeenMutation);
  const [
    { commentWithTraversalFocus, commentsFullyLoaded, commentsOrderBy },
    setLocal,
  ] = useLocal<KeyboardShortcuts_local>(graphql`
    fragment KeyboardShortcuts_local on Local {
      commentWithTraversalFocus
      keyboardShortcutsConfig {
        key
        source
        reverse
      }
      loadAllButtonHasBeenClicked
      commentsFullyLoaded
      showCommentIDs
      commentsOrderBy
    }
  `);
  const amp = useAMP();
  const zKeyEnabled = useZKeyEnabled();
  const commentSeenEnabled = useCommentSeenEnabled();

  // Used to enable/disable the mobile toolbar buttons for Unmark all and Next unread
  const [disableUnreadButtons, setDisableUnreadButtons] = useState<boolean>(
    commentsFullyLoaded ?? false
  );
  // Used to let the event listener know when the Z key has clicked a load more button
  // and it should therefore traverse to the next unread comment
  const [zKeyClickedButton, setZKeyClickedButton] = useState(false);

  // Used to compare view new count before/after unmark all to see if new comment subscriptions
  // have come in since all comments (including the new ones) have been marked as seen
  const [viewNewCountBeforeUnmarkAll, setViewNewCountBeforeUnmarkAll] =
    useState(viewNewCount);

  const [hasMoreCommentsToLoad, setHasMoreCommentsToLoad] = useState(false);

  useEffect(() => {
    if (commentsFullyLoaded) {
      if (hasMore) {
        setHasMoreCommentsToLoad(true);
      } else {
        setHasMoreCommentsToLoad(false);
      }
    }
  }, [hasMore, commentsFullyLoaded]);

  const newCommentsAreStillMarkedUnseen = useMemo(() => {
    const noNewCommentsHaveBeenMarkedSeenWithUnmarkAll =
      viewNewCountBeforeUnmarkAll === 0;
    const newCommentsHaveComeInSinceUnmarkAllWasPressed =
      viewNewCountBeforeUnmarkAll > 0 &&
      viewNewCount > viewNewCountBeforeUnmarkAll;
    return (
      viewNewCount > 0 &&
      (noNewCommentsHaveBeenMarkedSeenWithUnmarkAll ||
        newCommentsHaveComeInSinceUnmarkAllWasPressed)
    );
  }, [viewNewCount, viewNewCountBeforeUnmarkAll]);

  // Keeps the mobile toolbar button states updated whenever comments or the
  // viewNewCount changes
  useEffect(() => {
    if (
      !commentsFullyLoaded ||
      newCommentsAreStillMarkedUnseen ||
      hasMoreCommentsToLoad
    ) {
      if (disableUnreadButtons) {
        setDisableUnreadButtons(false);
        return;
      }
    }
    const unseenComment = comments.find((comment: Comment) => {
      if (!comment.node.ignored) {
        if (comment.node.seen === false && !comment.node.deleted) {
          return true;
        }
        const allChildCommentIDs = comment.node.allChildComments?.edges.map(
          (childComment) => {
            return childComment.node.id;
          }
        );
        if (
          comment.node.allChildComments &&
          comment.node.allChildComments.edges.some(
            (childComment: ChildComment) => {
              if (
                childComment.node.seen === false &&
                !childComment.node.deleted &&
                !comment.node.ignoredReplies?.includes(childComment.node.id)
              ) {
                if (childComment.node.ancestorIDs) {
                  const ancestorIDMissingFromChildIDs =
                    childComment.node.ancestorIDs?.some(
                      (ancestorID) =>
                        !(
                          allChildCommentIDs.includes(ancestorID || "") ||
                          ancestorID === comment.node.id
                        )
                    );
                  return !ancestorIDMissingFromChildIDs;
                }
                return true;
              }
              return false;
            }
          )
        ) {
          return true;
        }
      }
      return false;
    });
    if (unseenComment) {
      if (disableUnreadButtons) {
        setDisableUnreadButtons(false);
      }
    } else {
      if (!disableUnreadButtons) {
        setDisableUnreadButtons(true);
      }
    }
  }, [
    comments,
    newCommentsAreStillMarkedUnseen,
    commentsFullyLoaded,
    hasMoreCommentsToLoad,
  ]);

  const unmarkAll = useCallback(
    async (config: { source: "keyboard" | "mobileToolbar" }) => {
      UnmarkAllEvent.emit(eventEmitter, { source: config.source });
      setViewNewCountBeforeUnmarkAll(viewNewCount);
      try {
        await markSeen({
          storyID,
          commentIDs: [],
          updateSeen: true,
          markAllAsSeen: true,
          orderBy: commentsOrderBy,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [
      eventEmitter,
      markSeen,
      storyID,
      viewNewCount,
      setViewNewCountBeforeUnmarkAll,
      commentsOrderBy,
    ]
  );

  const handleUnmarkAllButton = useCallback(async () => {
    await unmarkAll({ source: "mobileToolbar" });
  }, [unmarkAll]);

  const handleCloseToolbarButton = useCallback(() => {
    setToolbarClosed(true);
    CloseMobileToolbarEvent.emit(eventEmitter);
  }, [eventEmitter, setToolbarClosed]);

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
    (comment: HTMLElement) => {
      if (customScrollContainer) {
        comment.scrollIntoView();
      } else {
        const offset =
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          comment.getBoundingClientRect().top + renderWindow.pageYOffset - 150;
        renderWindow.scrollTo({ top: offset });
      }
    },
    [renderWindow, customScrollContainer]
  );

  const findViewNewCommentButtonAndClick = useCallback(() => {
    const newCommentsButtonInRoot = root.getElementById(
      "comments-allComments-viewNewButton"
    );
    if (newCommentsButtonInRoot) {
      setZKeyClickedButton(true);
      newCommentsButtonInRoot.click();
    }
  }, [root, setZKeyClickedButton]);

  // If next unseen comment is a root comment, scroll to it, set focus, and mark seen.
  // If the next unseen comment is a reply, find that comment beneath its root comment.
  // If the next unseen is behind a Show more or View new comments button, then click that
  // button and load in the needed replies. Once the comment is found, focus is set and
  // the comment is marked as seen.
  const findCommentAndSetFocus = useCallback(
    (
      nextUnseen: UnseenComment,
      rootCommentElement: HTMLElement,
      source: "keyboard" | "mobileToolbar"
    ) => {
      // If next unseen is a root comment, we can just scroll to it, set focus, and
      // mark it as seen.
      if (nextUnseen.isRoot) {
        JumpToNextUnseenCommentEvent.emit(eventEmitter, {
          source,
        });
        scrollToComment(rootCommentElement);
        setFocusAndMarkSeen(nextUnseen.nodeID!);
      } else {
        const rootCommentKeyStop = toKeyStop(rootCommentElement);
        const nextUnseenKeyStop = findNextKeyStop(root, rootCommentKeyStop, {
          skipSeen: true,
        });

        if (nextUnseenKeyStop) {
          // if there are no unseen comments before the next show all replies
          // button, load all replies (traversal to next unseen comment will
          // be handled after the success event for all replies loading)
          if (nextUnseenKeyStop.isLoadMore) {
            const stopBeforeNextUnseen = findPreviousKeyStop(
              root,
              nextUnseenKeyStop,
              {
                skipLoadMore: true,
              }
            );
            if (stopBeforeNextUnseen) {
              setFocusAndMarkSeen(
                parseCommentElementID(stopBeforeNextUnseen.id)
              );
            }
            setZKeyClickedButton(true);
            nextUnseenKeyStop.element.click();
          } else {
            // go to the first unseen reply to the root comment and set focus to it
            JumpToNextUnseenCommentEvent.emit(eventEmitter, {
              source,
            });
            scrollToComment(nextUnseenKeyStop.element);
            setFocusAndMarkSeen(parseCommentElementID(nextUnseenKeyStop.id));
          }
        }
      }
    },
    [root, setFocusAndMarkSeen, scrollToComment, eventEmitter]
  );

  // This searches through root-level comments and all of their children to find the next
  // unseen comment. It searches from either (1) the provided Virtuoso index or (2) the
  // comment that currently has traversal focus.
  const searchInComments = useCallback(
    (virtuosoIndexToSearchFrom?: number) => {
      let indexToSearchFromOrCurrentTraversalFocusPassed =
        !commentWithTraversalFocus;
      let loopBackAroundUnseenComment: UnseenComment | undefined;
      let nextUnseenComment: UnseenComment | undefined;

      // If there are new comments via subscription, return next unseen with isNew
      // if there's no comment with traversal focus. Otherwise, set as the
      // loopBackAroundUnseenComment in case we loop back around looking for the next unseen.
      if (newCommentsAreStillMarkedUnseen) {
        if (!commentWithTraversalFocus) {
          nextUnseenComment = { isNew: true, isRoot: true };
          return nextUnseenComment;
        } else {
          loopBackAroundUnseenComment = { isNew: true, isRoot: true };
        }
      }

      // Search through the comments stream for the next unseen.
      // If found, add its node id and whether it's a root comment or reply.
      const nextUnseenExists = comments.find((comment, i) => {
        if (
          indexToSearchFromOrCurrentTraversalFocusPassed ||
          !loopBackAroundUnseenComment
        ) {
          if (!comment.node.ignored) {
            if (comment.node.seen === false && !comment.node.deleted) {
              const unseen = {
                isRoot: true,
                nodeID: comment.node.id,
                virtuosoIndex: i,
                rootCommentID: comment.node.id,
              };
              if (indexToSearchFromOrCurrentTraversalFocusPassed) {
                nextUnseenComment = unseen;
                return true;
              } else {
                if (!loopBackAroundUnseenComment) {
                  loopBackAroundUnseenComment = unseen;
                }
              }
            }
            const allChildCommentIDs =
              comment.node.allChildComments?.edges.map((childComment) => {
                return childComment.node.id;
              }) || [];
            if (
              comment.node.allChildComments &&
              comment.node.allChildComments.edges.some((c) => {
                if (
                  c.node.seen === false &&
                  !c.node.deleted &&
                  !comment.node.ignoredReplies?.includes(c.node.id)
                ) {
                  // Need to check that all of this replies' ancestorIDs are included in
                  // the root comment's childIDs; otherwise, an ancestor is not visible
                  // for some reason (i.e. is rejected)
                  let ancestorIDMissingFromChildIDs = false;
                  if (c.node.ancestorIDs) {
                    ancestorIDMissingFromChildIDs = c.node.ancestorIDs.some(
                      (ancestorID) =>
                        !(
                          allChildCommentIDs.includes(ancestorID || "") ||
                          ancestorID === comment.node.id
                        )
                    );
                  }
                  if (!ancestorIDMissingFromChildIDs) {
                    const unseen = {
                      isRoot: false,
                      nodeID: c.node.id,
                      virtuosoIndex: i,
                      rootCommentID: comment.node.id,
                    };
                    if (indexToSearchFromOrCurrentTraversalFocusPassed) {
                      nextUnseenComment = unseen;
                      return true;
                    } else {
                      if (!loopBackAroundUnseenComment) {
                        loopBackAroundUnseenComment = unseen;
                      }
                    }
                  }
                }
                return false;
              })
            ) {
              return true;
            }
          }
        }

        // If Virtuoso index to search from or current traversal focus hasn't been passed yet,
        // after we search for the next unseen in a comment and its replies, if it's not found,
        // we check if this is the Virtuoso index to search from or the node id with current
        // traversal focus
        if (!indexToSearchFromOrCurrentTraversalFocusPassed) {
          if (virtuosoIndexToSearchFrom) {
            if (i === virtuosoIndexToSearchFrom) {
              indexToSearchFromOrCurrentTraversalFocusPassed = true;
            }
          } else {
            if (
              comment.node.id === commentWithTraversalFocus ||
              (comment.node.allChildComments &&
                comment.node.allChildComments.edges.some(
                  (c) => c.node.id === commentWithTraversalFocus
                ))
            ) {
              indexToSearchFromOrCurrentTraversalFocusPassed = true;
            }
          }
        }
        return false;
      });
      // check for new comments at the end when sorted by oldest first
      if (commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
        return nextUnseenExists
          ? nextUnseenComment
          : hasMoreCommentsToLoad
          ? { isNew: true, isRoot: true }
          : loopBackAroundUnseenComment;
      }
      return nextUnseenExists ? nextUnseenComment : loopBackAroundUnseenComment;
    },
    [
      comments,
      commentWithTraversalFocus,
      newCommentsAreStillMarkedUnseen,
      commentsOrderBy,
      hasMoreCommentsToLoad,
    ]
  );

  // Determine the next unseen comment and then scroll Virtuoso to its index,
  // focus it, and mark it as seen.
  // We only call this if we've already tried traversing through the DOM to find
  // the next unseen, so we don't need to check if it's in the DOM before scrolling.
  const findAndNavigateToNextUnseen = useCallback(
    (
      virtuosoIndexToSearchFrom: number | undefined,
      source: "keyboard" | "mobileToolbar"
    ) => {
      // Search through comments for next unseen
      const nextUnseenComment = searchInComments(virtuosoIndexToSearchFrom);

      if (nextUnseenComment) {
        // If next unseen is new, scroll to the 0 index, find the View New button,
        // and click it.
        if (nextUnseenComment.isNew) {
          // oldest first view new comments
          if (commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
            setLocal({ loadAllButtonHasBeenClicked: true });
            currentScrollRef.current.scrollIntoView({
              align: "center",
              index: comments.length - 1,
              behavior: "auto",
              done: () => {
                // After Virtuoso scrolls, we have to make sure the new comment button
                // is available before setting focus to it or one of its replies.
                let count = 0;
                const virtuosoZeroExists = setInterval(async () => {
                  count += 1;
                  const virtuosoLastElementAfter = root.querySelector(
                    `[data-index="${comments.length - 1}"]`
                  );
                  if (
                    virtuosoLastElementAfter !== undefined &&
                    virtuosoLastElementAfter !== null
                  ) {
                    clearInterval(virtuosoZeroExists);
                    // find Load more button and click
                    const loadMoreButtonInRoot =
                      root.getElementById("comments-loadMore");
                    if (loadMoreButtonInRoot) {
                      const loadMoreKeyStop = toKeyStop(loadMoreButtonInRoot);
                      const previousKeyStop = findPreviousKeyStop(
                        root,
                        loadMoreKeyStop
                      );
                      if (previousKeyStop) {
                        setFocusAndMarkSeen(
                          parseCommentElementID(previousKeyStop.id)
                        );
                        setZKeyClickedButton(true);
                        loadMoreButtonInRoot.click();
                      }
                    }
                  }
                  if (count > 10) {
                    clearInterval(virtuosoZeroExists);
                  }
                }, 100);
              },
            });
            // newest sort new comments
          } else {
            currentScrollRef.current.scrollIntoView({
              align: "center",
              index: 0,
              behavior: "auto",
              done: () => {
                // After Virtuoso scrolls, we have to make sure the new comment button
                // is available before setting focus to it or one of its replies.
                let count = 0;
                const virtuosoZeroExists = setInterval(async () => {
                  count += 1;
                  const virtuosoZeroElementAfter =
                    root.querySelector('[data-index="0"]');
                  if (
                    virtuosoZeroElementAfter !== undefined &&
                    virtuosoZeroElementAfter !== null
                  ) {
                    clearInterval(virtuosoZeroExists);
                    findViewNewCommentButtonAndClick();
                  }
                  if (count > 10) {
                    clearInterval(virtuosoZeroExists);
                  }
                }, 100);
              },
            });
          }
        } else {
          // If a Load all comments button is currently displayed, but the next
          // unseen comment is at a Virtuoso index greater than the initial number
          // of comments we display, we need to hide the button and show those comments
          // so we can scroll to that next unseen.
          if (
            nextUnseenComment.virtuosoIndex &&
            nextUnseenComment.virtuosoIndex >= NUM_INITIAL_COMMENTS
          ) {
            setLocal({ loadAllButtonHasBeenClicked: true });
          }

          // Scroll to the Virtuoso index for the next unseen comment!
          // Then find the next unseen comment and set traversal focus to it.
          if (
            nextUnseenComment.nodeID &&
            nextUnseenComment.rootCommentID &&
            (nextUnseenComment.virtuosoIndex ||
              nextUnseenComment.virtuosoIndex === 0)
          ) {
            const rootComment = root.getElementById(
              computeCommentElementID(nextUnseenComment.rootCommentID)
            );
            if (rootComment) {
              setFocusAndMarkSeen(nextUnseenComment.rootCommentID);
              setTimeout(() => {
                findCommentAndSetFocus(nextUnseenComment, rootComment, source);
              }, 0);
            } else {
              currentScrollRef.current.scrollIntoView({
                align: "center",
                index: nextUnseenComment.virtuosoIndex,
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
                          rootCommentElement,
                          source
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
        }
      }
    },
    [
      findCommentAndSetFocus,
      currentScrollRef,
      searchInComments,
      root,
      setLocal,
      findViewNewCommentButtonAndClick,
      comments,
      commentsOrderBy,
      setZKeyClickedButton,
      setFocusAndMarkSeen,
    ]
  );

  // Traverse is used for C key traversal and for Z key traversal
  const traverse = useCallback(
    async (
      config: {
        key: "z" | "c";
        reverse: boolean;
        source: "keyboard" | "mobileToolbar";
      },
      noCircle?: boolean,
      calledByEventListener?: boolean,
      initialTraverse?: boolean
    ) => {
      let stop: KeyStop | null = null;
      let traverseOptions: TraverseOptions | undefined;

      if (config.key === "c" || (config.key === "z" && zKeyEnabled)) {
        if (config.key === "z") {
          traverseOptions = {
            skipSeen: true,
            noCircle: noCircle ?? false,
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

      // We check here that comment with current traversal focus is actually in the DOM
      // if this is the initial traverse called by Z key press / Next unread button.
      // This ensures that if someone scrolls up/down the page and comment with current
      // traversal focus is no longer in Virtuoso, we will get a predictable next unseen
      // comment, and not just the first unseen in what is currently rendered by Virtuoso.
      if (initialTraverse) {
        if (commentWithTraversalFocus) {
          const commentWithCurrentFocus = root.getElementById(
            computeCommentElementID(commentWithTraversalFocus)
          );
          if (!commentWithCurrentFocus) {
            // Need to find the index of the comment in Virtuoso and scroll to it in this
            // case and then traverse again, and search for next unseen if nothing found when
            // traversing. Otherwise, may skip replies in a comment that are unseen.
            const indexToScroll = comments.findIndex((comment) => {
              if (comment.node.id === commentWithTraversalFocus) {
                return true;
              }
              const childComments = comment.node.allChildComments?.edges.map(
                (c) => {
                  return c.node.id;
                }
              );
              if (
                childComments &&
                childComments.includes(commentWithTraversalFocus)
              ) {
                return true;
              }
              return false;
            });
            if (indexToScroll || indexToScroll === 0) {
              currentScrollRef.current.scrollIntoView({
                align: "center",
                index: indexToScroll,
                behavior: "auto",
                done: () => {
                  // After Virtuoso scrolls, we have to make sure the root comment
                  // is available before setting focus to it or one of its replies.
                  let count = 0;
                  const commentWithFocusElementExists = setInterval(
                    async () => {
                      count += 1;
                      const commentWithFocusElement = root.getElementById(
                        computeCommentElementID(commentWithTraversalFocus)
                      );
                      if (
                        commentWithFocusElement !== undefined &&
                        commentWithFocusElement !== null
                      ) {
                        clearInterval(commentWithFocusElementExists);
                        if (commentWithFocusElement) {
                          const traversed = await traverse(config);
                          if (traversed) {
                            return;
                          }

                          // If no next unseen is found in the DOM during traversal, then
                          // search through comments to find and navigate to next unseen
                          findAndNavigateToNextUnseen(undefined, config.source);
                        }
                      }
                      if (count > 10) {
                        findAndNavigateToNextUnseen(undefined, config.source);
                        clearInterval(commentWithFocusElementExists);
                      }
                    },
                    100
                  );
                },
              });
            }
            // Returning true because the traversal and finding next unseen is now being
            // handled after rootCommentElement is found
            return true;
          }
        } else {
          if (stop?.id === "comments-loadAll") {
            return false;
          }
          if (!commentsFullyLoaded) {
            await traverse(config);
          } else {
            return false;
          }
        }
      }

      if (!stop) {
        // If traverse was called by the event listener after more comments/replies
        // have loaded, and no next unread stop is found, then we need to search
        // through comments for the next unseen comment
        if (calledByEventListener) {
          const currentStop = getCurrentKeyStop(root, relayEnvironment);
          const currentVirtuosoIndex = currentStop?.element
            .closest("[data-index]")
            ?.getAttribute("data-index");
          if (currentVirtuosoIndex) {
            findAndNavigateToNextUnseen(
              parseInt(currentVirtuosoIndex, 10) + 1,
              config.source
            );
          }
        }
        return false;
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

      const stopElement = root.getElementById(stop.id);
      if (!stopElement) {
        return;
      }
      if (stop.id === "comments-loadAll" || stop.id === "comments-loadMore") {
        return false;
      }
      const offset =
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        stopElement.getBoundingClientRect().top +
        renderWindow.pageYOffset -
        150;
      if (customScrollContainer) {
        stopElement.scrollIntoView();
      } else {
        renderWindow.scrollTo({ top: offset });
      }

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
        setZKeyClickedButton(true);
        stop.element.click();
        return true;
      } else {
        setFocusAndMarkSeen(parseCommentElementID(stop.id));
        setTimeout(() => {
          if (customScrollContainer) {
            stopElement.scrollIntoView();
          } else {
            renderWindow.scrollTo({ top: offset });
          }
        }, 0);
        return true;
      }
    },
    [
      eventEmitter,
      relayEnvironment,
      root,
      renderWindow,
      setFocusAndMarkSeen,
      zKeyEnabled,
      currentScrollRef,
      commentWithTraversalFocus,
      comments,
      findAndNavigateToNextUnseen,
      setZKeyClickedButton,
      commentsFullyLoaded,
      customScrollContainer,
    ]
  );

  const [findAndNavigateAfterLoad, setFindAndNavigateAfterLoad] = useState<{
    findAndNavigate: boolean;
    source?: "keyboard" | "mobileToolbar";
  }>({ findAndNavigate: false });

  // Once comments are fully loaded, if findAndNavigate was set (meaning Z key or next
  // unread mobile button was pressed while comments were loading), then we find and
  // navigate to the next unseen comment.
  useEffect(() => {
    if (
      commentsFullyLoaded &&
      findAndNavigateAfterLoad.findAndNavigate &&
      findAndNavigateAfterLoad.source
    ) {
      findAndNavigateToNextUnseen(undefined, findAndNavigateAfterLoad.source);
      setFindAndNavigateAfterLoad({ findAndNavigate: false });
    }
  }, [
    findAndNavigateAfterLoad,
    commentsFullyLoaded,
    findAndNavigateToNextUnseen,
    setFindAndNavigateAfterLoad,
  ]);

  const handleZKeyPress = useCallback(
    async (source: "keyboard" | "mobileToolbar") => {
      if (disableUnreadButtons) {
        return;
      }

      // First, try to just traverse to the next unseen comment
      // if it's already loaded up in the DOM
      const traversed = await traverse(
        { key: "z", reverse: false, source },
        true,
        undefined,
        true
      );

      if (traversed) {
        return;
      }

      // If comments aren't yet fully loaded in, we scroll to the Load all button
      // while comments are loading in so the loading state is visible. Once they
      // load in, then we will find and navigate to the next unseen.
      if (!commentsFullyLoaded) {
        setLocal({ loadAllButtonHasBeenClicked: true });
        setFindAndNavigateAfterLoad({ findAndNavigate: true, source });
        const loadAllButton = root.getElementById("comments-loadAll");
        if (loadAllButton) {
          const loadAllKeyStop = toKeyStop(loadAllButton);
          scrollToComment(loadAllKeyStop?.element);
        }
        return;
      }

      // If no next unseen is found in the DOM during traversal, then
      // search through comments to find and navigate to next unseen
      findAndNavigateToNextUnseen(undefined, source);
    },
    [
      findAndNavigateToNextUnseen,
      traverse,
      commentWithTraversalFocus,
      comments,
      commentsFullyLoaded,
      root,
      scrollToComment,
      setLocal,
      disableUnreadButtons,
    ]
  );

  const toggleShowCommentIDs = useCallback(() => {
    const showCommentIDs = !!lookup(relayEnvironment, LOCAL_ID).showCommentIDs;
    setLocal({ showCommentIDs: !showCommentIDs });
  }, [relayEnvironment, setLocal]);

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

      const pressedKey = data.key.toLocaleLowerCase();

      // Alt + H
      if (data.altKey && pressedKey === "˙") {
        toggleShowCommentIDs();
      }

      if (data.ctrlKey || data.metaKey || data.altKey) {
        return;
      }

      // Ignore when we are not intersecting.
      if ("host" in root && !isElementIntersecting(root.host, renderWindow)) {
        return;
      }

      if (pressedKey === "a" && data.shiftKey) {
        await unmarkAll({ source: "keyboard" });
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
        await traverse({
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
      toggleShowCommentIDs,
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
    // Need to setTimeout to make sure that the Z key press is handled
    // after keyboardShortcutConfig is set
    setTimeout(() => {
      void handleZKeyPress("mobileToolbar");
    }, 0);
  }, [setLocal, handleZKeyPress]);

  // Traverse to next comment/reply after loading more/new comments and replies
  useEffect(() => {
    const listener: ListenerFn = async (e, data) => {
      if (loadMoreEvents.includes(e)) {
        // Announce height change to embed to allow
        // immediately updating amp iframe height
        // instead of waiting for polling to update it
        eventEmitter.emit("heightChange");

        // After more replies have loaded, we traverse
        // to the next reply based on the configuration.
        // Focus has already been set to the comment/reply that is directly
        // before the next unseen that we want to end up on.
        if (data.keyboardShortcutsConfig && zKeyClickedButton) {
          if (e === LoadMoreAllCommentsEvent.nameSuccess) {
            let count = 0;
            const stopExists: any = setInterval(async () => {
              count += 1;
              const stopElement = root.getElementById("comments-loadAll");
              if (stopElement === null) {
                clearInterval(stopExists);
                setZKeyClickedButton(false);
                await traverse(data.keyboardShortcutsConfig, true, true);
              }
              if (count > 10) {
                clearInterval(stopExists);
                setZKeyClickedButton(false);
              }
            }, 100);
          } else {
            setZKeyClickedButton(false);
            await traverse(data.keyboardShortcutsConfig, true, true);
          }
        }
      }
    };
    eventEmitter.onAny(listener);
    return () => {
      eventEmitter.offAny(listener);
    };
  }, [
    eventEmitter,
    traverse,
    commentSeenEnabled,
    zKeyClickedButton,
    setZKeyClickedButton,
    root,
  ]);

  // Subscribe to keypress events.
  useEffect(() => {
    renderWindow.addEventListener("keypress", handleWindowKeypress);
    root.addEventListener("keypress", handleKeypress as any);

    return () => {
      renderWindow.removeEventListener("keypress", handleWindowKeypress);
      root.removeEventListener("keypress", handleKeypress as any);
    };
  }, [handleKeypress, handleWindowKeypress, renderWindow, root]);

  if (amp || toolbarClosed || !zKeyEnabled) {
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
                    <span>Mark all as read</span>
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
