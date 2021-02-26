import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useEffectAfterMount, useEffectAtUnmount } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLocal,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveChatContainer_settings } from "coral-stream/__generated__/LiveChatContainer_settings.graphql";
import { LiveChatContainer_story } from "coral-stream/__generated__/LiveChatContainer_story.graphql";
import { LiveChatContainer_viewer } from "coral-stream/__generated__/LiveChatContainer_viewer.graphql";
import { LiveChatContainerAfterCommentEdge } from "coral-stream/__generated__/LiveChatContainerAfterCommentEdge.graphql";
import { LiveChatContainerBeforeCommentEdge } from "coral-stream/__generated__/LiveChatContainerBeforeCommentEdge.graphql";
import { LiveChatContainerLocal } from "coral-stream/__generated__/LiveChatContainerLocal.graphql";
import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";

import CursorState from "./cursorState";
import InView from "./InView";
import { LiveCommentContainer } from "./LiveComment";
import LiveCommentEnteredSubscription from "./LiveCommentEnteredSubscription";
import LiveCommentReplyContainer from "./LiveCommentReply/LiveCommentReplyContainer";
import LivePostCommentFormContainer from "./LivePostCommentFormContainer";

import styles from "./LiveChatContainer.css";

/**
 * scrollElement is a version of Element.scroll but also works in older browsers.
 *
 * TODO: (cvle) for some reason polyfilling Element.prototype failed.
 */
function scrollElement(element: Element, options: ScrollToOptions) {
  if (element.scroll) {
    element.scroll(options);
  } else {
    if (options.left !== undefined) {
      element.scrollLeft = options.left;
    }
    if (options.top !== undefined) {
      element.scrollTop = options.top;
    }
  }
}

interface Props {
  beforeComments: LiveChatContainerBeforeCommentEdge;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;

  afterComments: LiveChatContainerAfterCommentEdge;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;

  viewer: LiveChatContainer_viewer | null;
  settings: LiveChatContainer_settings;
  story: LiveChatContainer_story;

  cursorSet?: boolean;
}

const LiveChatContainer: FunctionComponent<Props> = ({
  beforeComments,
  beforeHasMore,
  loadMoreBefore,
  isLoadingMoreBefore,
  afterComments,
  afterHasMore,
  loadMoreAfter,
  isLoadingMoreAfter,
  viewer,
  settings,
  story,
  cursorSet,
}) => {
  const context = useCoralContext();
  const [
    {
      storyID,
      storyURL,
      liveChat: { tailing },
    },
    setLocal,
  ] = useLocal<LiveChatContainerLocal>(graphql`
    fragment LiveChatContainerLocal on Local {
      storyID
      storyURL
      liveChat {
        tailing
      }
    }
  `);

  const containerRef = useRef<any | null>(null);
  const beginRef = useRef<any | null>(null);
  const beforeAfterRef = useRef<any | null>(null);

  const scrollEnabled = useRef(false);
  const lastScrollTop = useRef(0);
  const scrollDir = useRef(0);

  const afterCommentsIncoming = useRef(false);
  const beforeCommentsIncoming = useRef(false);
  const beforeCommentScrollID = useRef<string | null>(null);

  const [
    focusedComment,
    setFocusedComment,
  ] = useState<LiveCommentReplyContainer_comment | null>(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [newReplyID, setNewReplyID] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  const setTailing = useCallback(
    (value: boolean) => {
      setLocal({ liveChat: { tailing: value } });
    },
    [setLocal]
  );

  const onScroll = useCallback(
    async (e) => {
      const container = containerRef.current;
      const begin = beginRef.current;

      if (!container || !begin || !scrollEnabled) {
        return;
      }

      scrollDir.current = container.scrollTop - lastScrollTop.current;

      const atBottom =
        Math.abs(
          container.scrollTop -
            (container.scrollHeight - container.offsetHeight)
        ) < 5;

      setTailing(atBottom);

      lastScrollTop.current = container.scrollTop;
    },
    [setTailing]
  );

  const scrollToBeforeAfter = useCallback(
    (behavior?: string) => {
      const beforeAfter = beforeAfterRef.current;
      beforeAfter.scrollIntoView({ behavior, block: "center" });
    },
    [beforeAfterRef]
  );

  const scrollToEnd = useCallback(
    (behavior?: ScrollOptions["behavior"]) => {
      const height = containerRef.current.scrollHeight;
      scrollElement(containerRef.current, { left: 0, top: height, behavior });
    },
    [containerRef]
  );

  useEffect(() => {
    if (cursorSet) {
      scrollToBeforeAfter();
    } else {
      scrollToEnd();
      setTailing(true);
    }

    if (containerRef.current) {
      lastScrollTop.current = containerRef.current.scrollTop;
    }

    // Enable scroll in a bit
    const timeoutReg = window.setTimeout(() => {
      scrollEnabled.current = true;
    }, 300);

    // Cleanup
    return () => {
      clearTimeout(timeoutReg);
    };
  }, [
    scrollToEnd,
    scrollEnabled,
    story.id,
    setTailing,
    cursorSet,
    scrollToBeforeAfter,
  ]);

  const scrollToAfterTimeout = useRef<number | null>(null);
  const beforeScrollToTimeout = useRef<number | null>(null);

  const afterCommentsChanged = useCallback(() => {
    if (tailing && !afterCommentsIncoming.current) {
      scrollEnabled.current = false;
      scrollToEnd("smooth");

      if (scrollToAfterTimeout.current) {
        clearTimeout(scrollToAfterTimeout.current);
      }

      scrollToAfterTimeout.current = window.setTimeout(() => {
        scrollEnabled.current = true;
      }, 300);
    }

    afterCommentsIncoming.current = false;
  }, [scrollToEnd, tailing]);

  /** Before Scroll */

  const clearBeforeScrollState = useCallback(() => {
    beforeCommentsIncoming.current = false;
    beforeCommentScrollID.current = null;
  }, []);

  const scrollToTargetComment = useCallback(() => {
    if (!beforeCommentScrollID.current) {
      return;
    }

    const el = document.getElementById(
      `comment-${beforeCommentScrollID.current}-top`
    );
    if (el) {
      el.scrollIntoView();
    }
  }, []);

  const scrollToTargetCommentAndClear = useCallback(() => {
    scrollToTargetComment();
    window.setTimeout(clearBeforeScrollState, 150);
  }, [clearBeforeScrollState, scrollToTargetComment]);

  const beforeCommentsChanged = useCallback(() => {
    if (beforeScrollToTimeout.current) {
      clearTimeout(beforeScrollToTimeout.current);
    }

    beforeScrollToTimeout.current = window.setTimeout(
      scrollToTargetCommentAndClear,
      150
    );
  }, [scrollToTargetCommentAndClear]);

  const onBeginInView = useCallback(async () => {
    if (
      beforeHasMore &&
      !isLoadingMoreBefore &&
      !beforeCommentsIncoming.current
    ) {
      try {
        beforeCommentsIncoming.current = true;
        setTailing(false);

        if (beforeComments.length > 0) {
          beforeCommentScrollID.current = beforeComments[0].node.id;
        }

        scrollToTargetComment();
        await loadMoreBefore();
      } catch (err) {
        // ignore for now
      }
    }
  }, [
    beforeComments,
    beforeHasMore,
    isLoadingMoreBefore,
    loadMoreBefore,
    scrollToTargetComment,
    setTailing,
  ]);

  /** Before Scroll END */

  useEffectAfterMount(() => {
    beforeCommentsChanged();
  }, [beforeComments, beforeCommentsChanged]);

  useEffectAfterMount(() => {
    afterCommentsChanged();
  }, [afterComments, afterCommentsChanged]);

  useEffectAtUnmount(() => {
    if (scrollToAfterTimeout.current) {
      clearTimeout(scrollToAfterTimeout.current);
    }
    if (beforeScrollToTimeout.current) {
      clearTimeout(beforeScrollToTimeout.current);
    }
  });

  const subscribeToCommentEntered = useSubscription(
    LiveCommentEnteredSubscription
  );

  useEffect(() => {
    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      storyConnectionKey: "Chat_after",
    });

    return () => {
      disposable.dispose();
    };
  }, [story.id, subscribeToCommentEntered, afterHasMore]);

  const onCommentVisible = useCallback(
    async (visible: boolean, id: string, createdAt: string, cursor: string) => {
      const key = `liveCursor:${storyID}:${storyURL}`;

      const rawValue = await context.localStorage.getItem(key);
      let current: CursorState | null = null;
      if (rawValue) {
        current = JSON.parse(rawValue);
      }

      if (current && new Date(createdAt) > new Date(current.createdAt)) {
        await context.localStorage.setItem(
          key,
          JSON.stringify({
            createdAt,
            cursor,
          })
        );
      } else if (!current) {
        await context.localStorage.setItem(
          key,
          JSON.stringify({
            createdAt,
            cursor,
          })
        );
      }
    },
    [context.localStorage, storyID, storyURL]
  );

  const onShowReplyDialog = useCallback(
    (comment: LiveCommentReplyContainer_comment) => {
      const el = document.getElementById(`comment-${comment.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "end" });
      }

      setFocusedComment(comment);
      setShowConversation(false);
      setReplyVisible(true);
    },
    [setReplyVisible, setFocusedComment, setShowConversation]
  );

  const onShowConversation = useCallback(
    (comment: LiveCommentReplyContainer_comment) => {
      setFocusedComment(comment);
      setShowConversation(true);
      setReplyVisible(true);
    },
    [setReplyVisible, setFocusedComment, setShowConversation]
  );

  const onCloseReply = useCallback(() => {
    setFocusedComment(null);
    setShowConversation(false);
    setReplyVisible(false);
  }, [setReplyVisible, setFocusedComment]);

  const onReplySubmitted = useCallback(
    (commentID?: string) => {
      if (showConversation) {
        return;
      }

      if (commentID) {
        setNewReplyID(commentID);
      }

      setReplyVisible(false);
      setFocusedComment(null);
    },
    [showConversation, setNewReplyID, setReplyVisible, setFocusedComment]
  );

  const scrollToNewReply = useCallback(() => {
    if (!newReplyID) {
      return;
    }

    const el = document.getElementById(`comment-${newReplyID}`);
    if (!el) {
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setNewReplyID(null);
  }, [newReplyID, setNewReplyID]);

  const onEndInView = useCallback(async () => {
    if (afterHasMore && !isLoadingMoreAfter && !afterCommentsIncoming.current) {
      try {
        afterCommentsIncoming.current = true;
        setTailing(false);
        await loadMoreAfter();
      } catch (err) {
        // ignore for now
      }
    }
  }, [afterHasMore, isLoadingMoreAfter, loadMoreAfter, setTailing]);

  return (
    <>
      <IntersectionProvider>
        <div
          id="live-chat-comments"
          className={styles.streamContainer}
          onScroll={onScroll}
          ref={containerRef}
        >
          <div id="begin" ref={beginRef} className={styles.begin}>
            <InView onInView={onBeginInView} />
          </div>
          <div id="pre-before"></div>

          {beforeComments.map((e) => (
            <LiveCommentContainer
              key={e.node.id}
              comment={e.node}
              cursor={e.cursor}
              viewer={viewer}
              settings={settings}
              onInView={onCommentVisible}
              onReplyTo={onShowReplyDialog}
              onShowConversation={onShowConversation}
            />
          ))}

          <div id="before-after" ref={beforeAfterRef}>
            {afterComments && afterComments.length > 0 && (
              <Flex justifyContent="center" alignItems="center">
                <hr className={styles.newhr} />
                <div className={styles.newDiv}>
                  New <Icon size="md">arrow_downward</Icon>
                </div>
                <hr className={styles.newhr} />
              </Flex>
            )}
          </div>

          {afterComments.map((e) => (
            <LiveCommentContainer
              key={e.node.id}
              comment={e.node}
              cursor={e.cursor}
              viewer={viewer}
              settings={settings}
              onInView={onCommentVisible}
              onReplyTo={onShowReplyDialog}
              onShowConversation={onShowConversation}
            />
          ))}

          <div id="pre-end"></div>
          <div id="end" className={styles.end}>
            <InView onInView={onEndInView} />
          </div>
          <div className={styles.endFooter}></div>
        </div>
      </IntersectionProvider>

      {newReplyID && (
        <div className={styles.scrollToNewReply}>
          <Button onClick={scrollToNewReply} color="primary">
            Reply posted below <Icon>arrow_downward</Icon>
          </Button>
        </div>
      )}
      {replyVisible && focusedComment && (
        <LiveCommentReplyContainer
          settings={settings}
          viewer={viewer}
          story={story}
          comment={focusedComment as any}
          visible={replyVisible}
          onClose={onCloseReply}
          onSubmitted={onReplySubmitted}
          showConversation={showConversation}
        />
      )}
      <LivePostCommentFormContainer
        settings={settings}
        story={story}
        viewer={viewer}
        commentsOrderBy={GQLCOMMENT_SORT.CREATED_AT_ASC}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  beforeComments: graphql`
    fragment LiveChatContainerBeforeCommentEdge on CommentEdge
      @relay(plural: true) {
      cursor
      node {
        id
        ...LiveCommentContainer_comment
      }
    }
  `,
  afterComments: graphql`
    fragment LiveChatContainerAfterCommentEdge on CommentEdge
      @relay(plural: true) {
      cursor
      node {
        id
        ...LiveCommentContainer_comment
      }
    }
  `,
  story: graphql`
    fragment LiveChatContainer_story on Story {
      id
      url
      ...LivePostCommentFormContainer_story
      ...LiveCommentReplyContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveChatContainer_viewer on User {
      ...LivePostCommentFormContainer_viewer
      ...LiveCommentContainer_viewer
      ...LiveCommentReplyContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveChatContainer_settings on Settings {
      ...LivePostCommentFormContainer_settings
      ...LiveCommentContainer_settings
      ...LiveCommentReplyContainer_settings
    }
  `,
})(LiveChatContainer);

export default enhanced;
