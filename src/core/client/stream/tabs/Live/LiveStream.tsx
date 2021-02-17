import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { useEffectAtUnmount } from "coral-framework/hooks";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";

import { LiveStreamContainer_settings } from "coral-stream/__generated__/LiveStreamContainer_settings.graphql";
import { LiveStreamContainer_story } from "coral-stream/__generated__/LiveStreamContainer_story.graphql";
import { LiveStreamContainer_viewer } from "coral-stream/__generated__/LiveStreamContainer_viewer.graphql";
import { LiveStreamContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveStreamContainerPaginationQuery.graphql";

import AfterComments from "./AfterComments";
import LiveCommentContainer from "./LiveComment";
import LivePostCommentFormContainer from "./LivePostCommentFormContainer";

import styles from "./LiveStream.css";

interface Props {
  viewer: LiveStreamContainer_viewer | null;
  settings: LiveStreamContainer_settings;
  story: LiveStreamContainer_story;
  relay: RelayPaginationProp;
  cursor: string;
}

const LiveStream: FunctionComponent<Props> = ({
  viewer,
  settings,
  story,
  relay,
  cursor,
}) => {
  const scrollEnabled = useRef(false);

  const [tailing, setTailing] = useState(false);
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const containerRef = useRef<any>(null);
  const beginRef = useRef<any>(null);
  const endRef = useRef<any>(null);

  const beforeComments = useMemo(() => {
    const before = story.before;
    const comments = before?.edges.map((e: { node: any }) => e.node) || [];

    return comments.slice().reverse();
  }, [story]);

  const beforeCommentsRender = useMemo(() => {
    return (
      <>
        {beforeComments.map((c: any) => (
          <div key={c.id}>
            <LiveCommentContainer
              comment={c}
              viewer={viewer}
              settings={settings}
            />
          </div>
        ))}
      </>
    );
  }, [beforeComments, settings, viewer]);

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
      relay.hasMore() &&
      !isLoadingMore &&
      scrollEnabled.current
    ) {
      try {
        scrollEnabled.current = false;
        await loadMore();

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
    scrollEnabled,
    relay,
    isLoadingMore,
    loadMore,
    beforeComments,
    scrollToID,
    endRef,
    setTailing,
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

  useEffectAtUnmount(() => {
    if (!scrollToAfterTimeout.current) {
      return;
    }
    clearTimeout(scrollToAfterTimeout.current);
  });

  return (
    <>
      <div
        className={styles.streamContainer}
        onScroll={onScroll}
        ref={containerRef}
      >
        <div ref={beginRef} />
        {beforeCommentsRender}
        <div>-- BEFORE/AFTER --</div>
        <AfterComments
          story={story}
          viewer={viewer}
          settings={settings}
          cursor={cursor}
          onCommentsChanged={afterCommentsChanged}
        />
        <div id="after" ref={endRef} />
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

type FragmentVariables = Omit<
  LiveStreamContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveStreamContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment LiveStreamContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        id
        before: comments(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_DESC
          first: $count
          inclusive: true
        ) @connection(key: "Chat_before", filters: ["orderBy"]) {
          edges {
            cursor
            node {
              id
              ...LiveCommentContainer_comment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        ...AfterCommentsContainer_story @arguments(cursor: $cursor)
        ...LivePostCommentFormContainer_story
      }
    `,
    viewer: graphql`
      fragment LiveStreamContainer_viewer on User {
        ...LiveCommentContainer_viewer
        ...AfterCommentsContainer_viewer
        ...LivePostCommentFormContainer_viewer
      }
    `,
    settings: graphql`
      fragment LiveStreamContainer_settings on Settings {
        ...LiveCommentContainer_settings
        ...AfterCommentsContainer_settings
        ...LivePostCommentFormContainer_settings
      }
    `,
  },
  {
    getConnectionFromProps({ story }) {
      return story && story.before;
    },
    getVariables(
      { story, cursor },
      { count, cursor: paginationCursor = cursor },
      fragmentVariables
    ) {
      return {
        count,
        cursor: paginationCursor,
        includeBefore: true,
        includeAfter: true,
        storyID: story.id,
        flattenReplies: true,
      };
    },
    query: graphql`
      query LiveStreamContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...LiveStreamContainer_story
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveStream);

export type LiveStreamProps = PropTypesOf<typeof enhanced>;
export default enhanced;
