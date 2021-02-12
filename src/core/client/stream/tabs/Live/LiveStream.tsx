import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { graphql, RelayPaginationProp } from "react-relay";

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
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);
  const [scrollEnabled, setScrollEnabled] = useState(false);

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

  const containerRef = useRef(null);
  const beginRef = useRef(null);

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

        setScrollEnabled(true);
      }
    },
    [containerRef, setScrollEnabled]
  );

  const onScroll = useCallback(async () => {
    const container = containerRef.current;
    const begin = beginRef.current;

    if (!container || !begin || !scrollEnabled) {
      return;
    }

    const containerRect = (container as any).getBoundingClientRect();
    const beginRect = (begin as any).getBoundingClientRect();

    if (
      containerRect.y - beginRect.y < 100 &&
      relay.hasMore() &&
      !isLoadingMore &&
      scrollEnabled
    ) {
      try {
        setScrollEnabled(false);
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
  }, [
    scrollEnabled,
    relay,
    isLoadingMore,
    loadMore,
    beforeComments,
    scrollToID,
  ]);

  const endRef = useRef(null);
  useEffect(() => {
    if (!endRef.current) {
      return;
    }

    const end = endRef.current as any;
    end.scrollIntoView();

    setTimeout(() => {
      setScrollEnabled(true);
    }, 300);
  }, [endRef, setScrollEnabled]);

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
        />
        <div ref={endRef} />
      </div>
      <LivePostCommentFormContainer
        settings={settings}
        story={story}
        viewer={viewer}
        commentsOrderBy={GQLCOMMENT_SORT.CREATED_AT_DESC}
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
