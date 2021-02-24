import React, { FunctionComponent, useCallback, useRef } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentRepliesContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesContainer_comment.graphql";
import { LiveCommentRepliesContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesContainerPaginationQuery.graphql";

import styles from "./LiveCommentRepliesContainer.css";

interface Props {
  comment: LiveCommentRepliesContainer_comment;
  relay: RelayPaginationProp;
}

const LiveCommentRepliesContainer: FunctionComponent<Props> = ({
  comment,
  relay,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const rootRef = useRef<any | null>(null);

  const onScroll = useCallback(async () => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const atBottom =
      Math.abs(root.scrollTop - (root.scrollHeight - root.offsetHeight)) < 5;

    if (atBottom && relay.hasMore() && !isLoadingMore) {
      try {
        await loadMore();
      } catch (err) {
        // ignore for now
      }
    }
  }, [rootRef, relay, isLoadingMore, loadMore]);

  return (
    <div onScroll={onScroll} className={styles.root} ref={rootRef}>
      <div>
        <div>{comment.id}</div>
        <div>{comment.body || ""}</div>
      </div>
      <div>---</div>
      <div>
        {comment.replies.edges.map((c) => {
          return (
            <div key={`chat-reply-${c.node.id}`}>
              <div>{c.node.id}</div>
              <div>{c.node.body || ""}</div>
            </div>
          );
        })}
      </div>
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
        body
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
              body
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
                body
              }
            }
            edges {
              node {
                id
                body
              }
            }
          }
        }
      }
    `,
  }
)(LiveCommentRepliesContainer);

export default enhanced;
