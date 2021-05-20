import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";
import { FragmentRefs } from "relay-runtime";

import { globalErrorReporter } from "coral-framework/lib/errors";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentsAfterContainer_story } from "coral-stream/__generated__/LiveCommentsAfterContainer_story.graphql";
import { LiveCommentsAfterContainer_viewer } from "coral-stream/__generated__/LiveCommentsAfterContainer_viewer.graphql";
import { LiveCommentsAfterContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentsAfterContainerPaginationQuery.graphql";

import filterIgnoredComments from "./helpers/filterIgnoredComments";

interface RenderProps {
  afterComments: ReadonlyArray<{
    readonly " $fragmentRefs": FragmentRefs<
      "LiveChatContainerAfterCommentEdge"
    >;
  }>;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  story: LiveCommentsAfterContainer_story;
  viewer: LiveCommentsAfterContainer_viewer | null;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentsAfterContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  if (!story.after) {
    const err = new Error(`Chat_after connection is ${story.after}`);
    globalErrorReporter.report(err);
    if (process.env.NODE_ENV !== "production") {
      throw err;
    }
  } else if (!story.after.pageInfo) {
    const err = new Error(
      `PageInfo of Chat_after connection is ${story.after.pageInfo}`
    );
    globalErrorReporter.report(err);
    if (process.env.NODE_ENV !== "production") {
      throw err;
    }
  }

  const afterHasMore =
    story.after && story.after.pageInfo
      ? story.after.pageInfo.hasNextPage
      : false;

  const initialIgnoredUsers = useMemo(
    () => (viewer ? viewer.ignoredUsers.map((u) => u.id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewer?.id]
  );
  const filtered = useMemo(
    () =>
      filterIgnoredComments(
        initialIgnoredUsers,
        story.after && story.after.edges ? story.after.edges : []
      ),
    [initialIgnoredUsers, story.after]
  );

  return children({
    afterComments: filtered,
    afterHasMore,
    loadMoreAfter: loadMore,
    isLoadingMoreAfter: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentsAfterContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentsAfterContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment LiveCommentsAfterContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "Cursor" }
          inclusive: { type: "Boolean!" }
        ) {
        id
        after: comments(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_ASC
          first: $count
          inclusive: $inclusive
        ) @connection(key: "Chat_after", filters: []) {
          edges {
            ...LiveChatContainerAfterCommentEdge
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
      fragment LiveCommentsAfterContainer_viewer on User {
        id
        ignoredUsers {
          id
        }
      }
    `,
  },
  {
    getConnectionFromProps({ story }) {
      return story && story.after;
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
      query LiveCommentsAfterContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...LiveCommentsAfterContainer_story
            @arguments(count: $count, cursor: $cursor, inclusive: false)
        }
      }
    `,
  }
)(LiveCommentsAfterContainer);

export default enhanced;
