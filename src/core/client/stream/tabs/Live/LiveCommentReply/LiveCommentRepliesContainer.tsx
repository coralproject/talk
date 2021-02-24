import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { withPaginationContainer } from "coral-framework/lib/relay";

import { LiveCommentRepliesContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesContainer_comment.graphql";
import { LiveCommentRepliesContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesContainerPaginationQuery.graphql";

interface Props {
  comment: LiveCommentRepliesContainer_comment;
  relay: RelayPaginationProp;
}

const LiveCommentRepliesContainer: FunctionComponent<Props> = ({
  comment,
  relay,
}) => {
  // const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  return (
    <div>
      {comment.replies.edges.map((c) => {
        return <div key={`chat-reply-${c.node.id}`}>{c.node.id}</div>;
      })}
    </div>
  );
};

type FragmentVariables = Omit<
  LiveCommentRepliesContainerPaginationQueryVariables,
  "id"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentRepliesContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveCommentRepliesContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        id
        replies(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_ASC
          first: $count
        ) @connection(key: "Chat_replies", filters: ["orderBy"]) {
          edges {
            cursor
            node {
              id
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
      return comment && comment.replies;
    },
    getVariables({ comment }, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        commentID: comment.id,
      };
    },
    query: graphql`
      query LiveCommentRepliesContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          replies(first: $count, after: $cursor, orderBy: CREATED_AT_ASC)
            @connection(key: "Chat_replies") {
            viewNewEdges {
              node {
                id
              }
            }
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `,
  }
)(LiveCommentRepliesContainer);

export default enhanced;
