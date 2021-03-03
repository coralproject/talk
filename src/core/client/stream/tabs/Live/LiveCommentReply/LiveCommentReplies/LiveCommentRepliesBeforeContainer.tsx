import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";
import { FragmentRefs } from "relay-runtime";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentRepliesBeforeContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesBeforeContainer_comment.graphql";
import { LiveCommentRepliesBeforeContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesBeforeContainerPaginationQuery.graphql";

interface RenderProps {
  beforeComments: ReadonlyArray<{
    readonly cursor: string;
    readonly node: {
      readonly id: string;
      readonly body: string | null;
      readonly createdAt: string;
      readonly author: {
        readonly username: string | null;
      } | null;
    };
    readonly " $fragmentRefs": FragmentRefs<
      "LiveCommentRepliesContainerBeforeCommentEdge"
    >;
  }>;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  comment: LiveCommentRepliesBeforeContainer_comment;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentRepliesBeforeContainer: FunctionComponent<Props> = ({
  comment,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const beforeHasMore = comment.before.pageInfo.hasNextPage;

  return children({
    beforeComments: comment.before.edges,
    beforeHasMore,
    loadMoreBefore: loadMore,
    isLoadingMoreBefore: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentRepliesBeforeContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentRepliesBeforeContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveCommentRepliesBeforeContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        id
        body
        createdAt
        author {
          username
        }
        before: replies(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_DESC
          first: $count
          inclusive: true
        ) @connection(key: "Replies_before", filters: ["orderBy"]) {
          edges {
            ...LiveCommentRepliesContainerBeforeCommentEdge
            cursor
            node {
              id
              body
              createdAt
              author {
                username
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps({ comment }) {
      return comment && comment.before;
    },
    getVariables(
      { comment, cursor },
      { count, cursor: paginationCursor = cursor },
      fragmentVariables
    ) {
      return {
        count,
        cursor: paginationCursor,
        includeBefore: true,
        includeAfter: true,
        commentID: comment.id,
        flattenReplies: true,
      };
    },
    query: graphql`
      query LiveCommentRepliesBeforeContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          ...LiveCommentRepliesBeforeContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveCommentRepliesBeforeContainer);

export default enhanced;
