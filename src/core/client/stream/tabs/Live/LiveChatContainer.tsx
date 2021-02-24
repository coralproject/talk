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
import { Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveChatContainer_settings } from "coral-stream/__generated__/LiveChatContainer_settings.graphql";
import { LiveChatContainer_story } from "coral-stream/__generated__/LiveChatContainer_story.graphql";
import { LiveChatContainer_viewer } from "coral-stream/__generated__/LiveChatContainer_viewer.graphql";
import { LiveChatContainerAfterComment } from "coral-stream/__generated__/LiveChatContainerAfterComment.graphql";
import { LiveChatContainerBeforeComment } from "coral-stream/__generated__/LiveChatContainerBeforeComment.graphql";
import { LiveChatContainerLocal } from "coral-stream/__generated__/LiveChatContainerLocal.graphql";
import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";

import CursorState from "./CursorState";
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
  beforeComments: LiveChatContainerBeforeComment;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;

  afterComments: LiveChatContainerAfterComment;
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
  const endRef = useRef<any | null>(null);
  const beforeAfterRef = useRef<any | null>(null);

  const scrollEnabled = useRef(false);
  const lastScrollTop = useRef(0);
  const scrollDir = useRef(0);

  const [
    focusedComment,
    setFocusedComment,
  ] = useState<LiveCommentReplyContainer_comment | null>(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [newReplyID, setNewReplyID] = useState<string | null>(null);

  const scrollToID = useCallback(
    (id: string) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
        }

        scrollEnabled.current = true;
      }
    },
    [containerRef, scrollEnabled]
  );

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
      const end = endRef.current;

      if (!container || !begin || !scrollEnabled) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const beginRect = begin.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();

      scrollDir.current = container.scrollTop - lastScrollTop.current;

      // Check to load previous comments
      if (
        containerRect.y - beginRect.y < 100 &&
        beforeHasMore &&
        !isLoadingMoreBefore &&
        scrollEnabled.current
      ) {
        try {
          scrollEnabled.current = false;
          await loadMoreBefore();

          if (beforeComments.length > 0) {
            const id = `comment-${beforeComments[0].id}`;

            window.requestAnimationFrame(() => {
              scrollToID(id);
              lastScrollTop.current = container.scrollTop;
            });
          }
        } catch (err) {
          // ignore for now
        }
      }

      let atBottom = Math.abs(containerRect.bottom - endRect.bottom) <= 5;

      if (
        atBottom &&
        afterHasMore &&
        !isLoadingMoreAfter &&
        scrollEnabled.current
      ) {
        try {
          scrollEnabled.current = false;
          await loadMoreAfter();
          scrollEnabled.current = true;
        } catch (err) {
          // ignore for now
        }
      }

      atBottom = Math.abs(containerRect.bottom - endRect.bottom) <= 5;

      setTailing(atBottom);

      lastScrollTop.current = container.scrollTop;
    },
    [
      afterHasMore,
      beforeComments,
      beforeHasMore,
      isLoadingMoreAfter,
      isLoadingMoreBefore,
      loadMoreAfter,
      loadMoreBefore,
      scrollToID,
      setTailing,
    ]
  );

  const scrollToBeforeAfter = useCallback(
    (behavior?: string) => {
      const beforeAfter = beforeAfterRef.current;
      beforeAfter.scrollIntoView({ behavior });
    },
    [beforeAfterRef]
  );

  const scrollToEnd = useCallback(
    (behavior?: ScrollOptions["behavior"]) => {
      // const end = endRef.current;
      // end.scrollIntoView({ behavior });

      const height = containerRef.current.scrollHeight;
      scrollElement(containerRef.current, { left: 0, top: height, behavior });
    },
    [containerRef]
  );

  useEffect(() => {
    if (!endRef.current) {
      return;
    }

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
    const timeoutReg = setTimeout(() => {
      scrollEnabled.current = true;
    }, 300);

    // Cleanup
    return () => {
      clearTimeout(timeoutReg);
    };
  }, [
    endRef,
    scrollToEnd,
    scrollEnabled,
    story.id,
    setTailing,
    cursorSet,
    scrollToBeforeAfter,
  ]);

  const scrollToAfterTimeout = useRef<NodeJS.Timeout | null>(null);

  const afterCommentsChanged = useCallback(() => {
    if (!tailing) {
      return;
    }

    scrollEnabled.current = false;
    scrollToEnd("smooth");

    if (scrollToAfterTimeout.current) {
      clearTimeout(scrollToAfterTimeout.current);
    }

    scrollToAfterTimeout.current = setTimeout(() => {
      scrollEnabled.current = true;
    }, 300);
  }, [scrollToEnd, tailing]);

  useEffectAfterMount(() => {
    afterCommentsChanged();
  }, [afterComments, afterCommentsChanged]);

  useEffectAtUnmount(() => {
    if (!scrollToAfterTimeout.current) {
      return;
    }
    clearTimeout(scrollToAfterTimeout.current);
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

  const onShowReply = useCallback(
    (comment: LiveCommentReplyContainer_comment) => {
      setFocusedComment(comment);
      setReplyVisible(true);
    },
    [setReplyVisible, setFocusedComment]
  );

  const onCloseReply = useCallback(() => {
    setFocusedComment(null);
    setReplyVisible(false);
  }, [setReplyVisible, setFocusedComment]);

  const onReplySubmitted = useCallback(
    (commentID?: string) => {
      if (commentID) {
        setNewReplyID(commentID);
      }

      setReplyVisible(false);
      setFocusedComment(null);
    },
    [setReplyVisible, setFocusedComment]
  );

  const scrollToNewReply = useCallback(() => {
    if (!newReplyID) {
      return;
    }

    const el = document.getElementById(`comment-${newReplyID}`);
    if (!el) {
      return;
    }

    el.scrollIntoView({ behavior: "smooth" });

    setNewReplyID(null);
  }, [newReplyID, setNewReplyID]);

  return (
    <IntersectionProvider>
      <div
        id="live-chat-comments"
        className={styles.streamContainer}
        onScroll={onScroll}
        ref={containerRef}
      >
        <div id="begin" ref={beginRef} />

        {beforeComments.map((c) => (
          <LiveCommentContainer
            key={c.id}
            comment={c}
            viewer={viewer}
            settings={settings}
            onInView={onCommentVisible}
            onReplyTo={onShowReply}
          />
        ))}
        <div id="before-after" ref={beforeAfterRef}>
          -- BEFORE/AFTER --
        </div>
        {afterComments.map((c) => (
          <LiveCommentContainer
            key={c.id}
            comment={c}
            viewer={viewer}
            settings={settings}
            onInView={onCommentVisible}
            onReplyTo={onShowReply}
          />
        ))}

        <div id="end" ref={endRef} />
      </div>
      {newReplyID && (
        <div className={styles.scrollToNewReply}>
          <Button onClick={scrollToNewReply} color="primary">
            Reply posted below <Icon>arrow_downward</Icon>
          </Button>
        </div>
      )}
      {replyVisible && focusedComment && storyID && viewer && (
        <LiveCommentReplyContainer
          settings={settings}
          viewer={viewer}
          story={story}
          comment={focusedComment as any}
          visible={replyVisible}
          onClose={onCloseReply}
          onSubmitted={onReplySubmitted}
        />
      )}
      <LivePostCommentFormContainer
        settings={settings}
        story={story}
        viewer={viewer}
        commentsOrderBy={GQLCOMMENT_SORT.CREATED_AT_ASC}
      />
    </IntersectionProvider>
  );
};

const enhanced = withFragmentContainer<Props>({
  beforeComments: graphql`
    fragment LiveChatContainerBeforeComment on Comment @relay(plural: true) {
      id
      ...LiveCommentContainer_comment
    }
  `,
  afterComments: graphql`
    fragment LiveChatContainerAfterComment on Comment @relay(plural: true) {
      id
      ...LiveCommentContainer_comment
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
