import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";
import { FragmentRefs } from "relay-runtime";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentRepliesAfterContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesAfterContainer_comment.graphql";
import { LiveCommentRepliesAfterContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesAfterContainerPaginationQuery.graphql";

interface RenderProps {
  afterComments: ReadonlyArray<{
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
      "LiveCommentRepliesContainerAfterCommentEdge"
    >;
  }>;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  comment: LiveCommentRepliesAfterContainer_comment;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentRepliesAfterContainer: FunctionComponent<Props> = ({
  comment,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const afterHasMore = comment.after.pageInfo.hasNextPage;

  return children({
    afterComments: comment.after.edges,
    afterHasMore,
    loadMoreAfter: loadMore,
    isLoadingMoreAfter: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentRepliesAfterContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentRepliesAfterContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveCommentRepliesAfterContainer_comment on Comment
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
        after: replies(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_ASC
          first: $count
        ) @connection(key: "Replies_after", filters: ["orderBy"]) {
          edges {
            ...LiveCommentRepliesContainerAfterCommentEdge
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
      return comment && comment.after;
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
      query LiveCommentRepliesAfterContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          ...LiveCommentRepliesAfterContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveCommentRepliesAfterContainer);

export default enhanced;
