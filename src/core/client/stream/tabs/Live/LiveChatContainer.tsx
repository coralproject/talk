import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useEffectAfterMount, useEffectAtUnmount } from "coral-framework/hooks";
import {
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";

import { LiveChatContainer_settings } from "coral-stream/__generated__/LiveChatContainer_settings.graphql";
import { LiveChatContainer_story } from "coral-stream/__generated__/LiveChatContainer_story.graphql";
import { LiveChatContainer_viewer } from "coral-stream/__generated__/LiveChatContainer_viewer.graphql";
import { LiveChatContainerAfterComment } from "coral-stream/__generated__/LiveChatContainerAfterComment.graphql";
import { LiveChatContainerBeforeComment } from "coral-stream/__generated__/LiveChatContainerBeforeComment.graphql";

import { LiveCommentContainer } from "./LiveComment";
import LiveCommentEnteredSubscription from "./LiveCommentEnteredSubscription";
import LivePostCommentFormContainer from "./LivePostCommentFormContainer";

import styles from "./LiveChatContainer.css";

interface Props {
  beforeComments: LiveChatContainerBeforeComment;
  beforeHasMore: () => boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;

  afterComments: LiveChatContainerAfterComment;
  afterHasMore: () => boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;

  viewer: LiveChatContainer_viewer | null;
  settings: LiveChatContainer_settings;
  story: LiveChatContainer_story;
}

const LiveChatContainer: FunctionComponent<Props> = ({
  beforeComments,
  beforeHasMore,
  loadMoreBefore,
  isLoadingMoreBefore,
  afterComments,
  viewer,
  settings,
  story,
}) => {
  const containerRef = useRef<any | null>(null);
  const beginRef = useRef<any | null>(null);
  const endRef = useRef<any | null>(null);

  const scrollEnabled = useRef(false);

  const [tailing, setTailing] = useState(false);

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

  const onScroll = useCallback(async () => {
    const container = containerRef.current;
    const begin = beginRef.current;
    const end = endRef.current;

    if (!container || !begin || !scrollEnabled) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const beginRect = begin.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    // Check to load previous comments
    if (
      containerRect.y - beginRect.y < 100 &&
      beforeHasMore() &&
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
          });
        }
      } catch (err) {
        // ignore
      }
    }

    setTailing(Math.abs(containerRect.bottom - endRect.bottom) <= 5);
  }, [
    beforeComments,
    beforeHasMore,
    isLoadingMoreBefore,
    loadMoreBefore,
    scrollToID,
  ]);

  const scrollToEnd = useCallback(
    (behavior?: string) => {
      // const end = endRef.current;
      // end.scrollIntoView({ behavior });

      const height = containerRef.current.scrollHeight;
      containerRef.current.scroll({ left: 0, top: height, behavior });
    },
    [containerRef]
  );

  useEffect(() => {
    if (!endRef.current) {
      return;
    }

    // Scroll to bottom
    scrollToEnd();
    setTailing(true);

    // Enable scroll in a bit
    const timeoutReg = setTimeout(() => {
      scrollEnabled.current = true;
    }, 300);

    // Cleanup
    return () => {
      clearTimeout(timeoutReg);
    };
  }, [endRef, scrollToEnd, scrollEnabled]);

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
    if (!tailing) {
      return;
    }

    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      storyConnectionKey: "Chat_after",
    });

    return () => {
      disposable.dispose();
    };
  }, [story.id, subscribeToCommentEntered, tailing]);

  return (
    <>
      <div
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
          />
        ))}
        <div>-- BEFORE/AFTER --</div>
        {afterComments.map((c) => (
          <LiveCommentContainer
            key={c.id}
            comment={c}
            viewer={viewer}
            settings={settings}
          />
        ))}
        <div id="end" ref={endRef} />
      </div>
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
      ...LivePostCommentFormContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveChatContainer_viewer on User {
      ...LivePostCommentFormContainer_viewer
      ...LiveCommentContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveChatContainer_settings on Settings {
      ...LivePostCommentFormContainer_settings
      ...LiveCommentContainer_settings
    }
  `,
})(LiveChatContainer);

export default enhanced;
