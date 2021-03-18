import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";
import { FragmentRefs } from "relay-runtime";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentsBeforeContainer_story } from "coral-stream/__generated__/LiveCommentsBeforeContainer_story.graphql";
import { LiveCommentsBeforeContainer_viewer } from "coral-stream/__generated__/LiveCommentsBeforeContainer_viewer.graphql";
import { LiveCommentsBeforeContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentsBeforeContainerPaginationQuery.graphql";

import filterIgnoredComments from "./helpers/filterIgnoredComments";

interface RenderProps {
  beforeComments: ReadonlyArray<{
    readonly " $fragmentRefs": FragmentRefs<
      "LiveChatContainerBeforeCommentEdge"
    >;
  }>;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  story: LiveCommentsBeforeContainer_story;
  viewer: LiveCommentsBeforeContainer_viewer | null;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentsBeforeContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const initialIgnoredUsers = useMemo(
    () => (viewer ? viewer.ignoredUsers.map((u) => u.id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewer?.id]
  );

  const beforeComments = useMemo(() => {
    const comments = story.before.edges || [];
    return filterIgnoredComments(
      initialIgnoredUsers,
      comments.slice().reverse()
    );
  }, [initialIgnoredUsers, story.before.edges]);
  const beforeHasMore = story.before.pageInfo.hasNextPage;

  return children({
    beforeComments,
    beforeHasMore,
    loadMoreBefore: loadMore,
    isLoadingMoreBefore: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentsBeforeContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentsBeforeContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment LiveCommentsBeforeContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 20 }
          cursor: { type: "Cursor" }
          inclusive: { type: "Boolean!" }
        ) {
        id
        before: comments(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_DESC
          first: $count
          inclusive: $inclusive
        ) @connection(key: "Chat_before", filters: []) {
          edges {
            ...LiveChatContainerBeforeCommentEdge
            node {
              author {
                id
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    viewer: graphql`
      fragment LiveCommentsBeforeContainer_viewer on User {
        id
        ignoredUsers {
          id
        }
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
        storyID: story.id,
      };
    },
    query: graphql`
      query LiveCommentsBeforeContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...LiveCommentsBeforeContainer_story
            @arguments(count: $count, cursor: $cursor, inclusive: false)
        }
      }
    `,
  }
)(LiveCommentsBeforeContainer);

export default enhanced;
