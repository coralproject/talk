import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";

import { LiveStreamContainer_settings } from "coral-stream/__generated__/LiveStreamContainer_settings.graphql";
import { LiveStreamContainer_story } from "coral-stream/__generated__/LiveStreamContainer_story.graphql";
import { LiveStreamContainer_viewer } from "coral-stream/__generated__/LiveStreamContainer_viewer.graphql";
import { LiveStreamContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveStreamContainerPaginationQuery.graphql";

import LiveCommentContainer from "./LiveComment";

import styles from "./LiveStream.css";

interface Props {
  viewer: LiveStreamContainer_viewer | null;
  settings: LiveStreamContainer_settings;
  story: LiveStreamContainer_story;
  relay: RelayPaginationProp;
}

const LiveStream: FunctionComponent<Props> = ({
  viewer,
  settings,
  story,
  relay,
}) => {
  const before = story.before;
  // const after = afterStory.after;
  const beforeComments = before?.edges.map((e: { node: any }) => e.node) || [];
  // const afterComments = after?.edges.map((e: { node: any }) => e.node) || [];

  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const containerRef = useRef(null);
  const beginRef = useRef(null);
  const onScroll = useCallback(async () => {
    const container = containerRef.current;
    const begin = beginRef.current;

    if (!container || !begin || !scrollEnabled) {
      return;
    }

    const containerRect = (container as any).getBoundingClientRect();
    const beginRect = (begin as any).getBoundingClientRect();

    if (containerRect.y - beginRect.y < 100 && !isLoadingMore) {
      try {
        await loadMore();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }, [beginRef, containerRef, scrollEnabled, isLoadingMore, loadMore]);

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
    <div
      className={styles.streamContainer}
      onScroll={onScroll}
      ref={containerRef}
    >
      <div ref={beginRef} />
      {beforeComments
        .slice()
        .reverse()
        .map((c: any) => (
          <div key={c.id}>
            <LiveCommentContainer
              comment={c}
              viewer={viewer}
              settings={settings}
            />
          </div>
        ))}
      {/* {afterComments.map((c: any) => (
        <div key={c.id}>
          <LiveCommentContainer
            comment={c}
            viewer={viewer}
            settings={settings}
          />
        </div>
      ))} */}
      <div ref={endRef} />
    </div>
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
        ) @connection(key: "Chat_before", filters: ["orderBy"]) {
          edges {
            cursor
            node {
              ...LiveCommentContainer_comment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
    viewer: graphql`
      fragment LiveStreamContainer_viewer on User {
        ...LiveCommentContainer_viewer
      }
    `,
    settings: graphql`
      fragment LiveStreamContainer_settings on Settings {
        ...LiveCommentContainer_settings
      }
    `,
  },
  {
    getConnectionFromProps({ story }) {
      return story && story.before;
    },
    getVariables({ story }, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
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
