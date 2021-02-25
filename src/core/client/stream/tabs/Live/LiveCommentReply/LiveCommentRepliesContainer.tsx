import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { Flex } from "coral-ui/components/v2";

import { LiveCommentRepliesContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesContainer_comment.graphql";
import { LiveCommentRepliesContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesContainerPaginationQuery.graphql";

import LiveCommentBody from "../LiveComment/LiveCommentBody";
import LiveReplyCommentEnteredSubscription from "./LiveReplyCommentEnteredSubscription";

import styles from "./LiveCommentRepliesContainer.css";

interface Props {
  comment: LiveCommentRepliesContainer_comment;
  storyID: string;
  relay: RelayPaginationProp;
}

const LiveCommentRepliesContainer: FunctionComponent<Props> = ({
  comment,
  relay,
  storyID,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);
  const subscribeToCommentEntered = useSubscription(
    LiveReplyCommentEnteredSubscription
  );
  useEffect(() => {
    const disposable = subscribeToCommentEntered({
      storyID,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      connectionKey: "Chat_replies",
      parentID: comment.id,
    });

    return () => {
      disposable.dispose();
    };
  }, [storyID, comment.id, subscribeToCommentEntered]);

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
      <div className={styles.comment}>
        <LiveCommentBody
          author={comment.author}
          body={comment.body}
          createdAt={comment.createdAt}
        />
      </div>
      <div>
        {comment.replies.edges.map((c) => {
          return (
            <div key={`chat-reply-${c.node.id}`} className={styles.comment}>
              <Flex justifyContent="flex-start" alignItems="stretch">
                <div className={styles.replyMarker}></div>
                <LiveCommentBody
                  author={c.node.author}
                  body={c.node.body}
                  createdAt={c.node.createdAt}
                />
              </Flex>
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
        createdAt
        author {
          username
        }
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
                createdAt
                author {
                  username
                }
              }
            }
          }
        }
      }
    `,
  }
)(LiveCommentRepliesContainer);

export default enhanced;
