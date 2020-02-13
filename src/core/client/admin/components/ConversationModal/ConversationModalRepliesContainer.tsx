// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Omit } from "coral-framework/types";
import { Button, HorizontalGutter } from "coral-ui/components/v2";

import { ConversationModalRepliesContainer_comment } from "coral-admin/__generated__/ConversationModalRepliesContainer_comment.graphql";
import { ConversationModalRepliesContainerPaginationQueryVariables } from "coral-admin/__generated__/ConversationModalRepliesContainerPaginationQuery.graphql";
import ConversationModalCommentContainer from "./ConversationModalCommentContainer";

// import styles from "./ConversationModalRepliesContainer.css";

interface Props {
  relay: RelayPaginationProp;
  comment: ConversationModalRepliesContainer_comment;
  onClose: () => void;
  onUsernameClicked: (id?: string) => void;
}

const ConversationModalRepliesContainer: FunctionComponent<Props> = ({
  comment,
  relay,
  onUsernameClicked,
}) => {
  const [loadMore] = useLoadMore(relay, 5);
  const replies = comment.replies.edges.map(edge => edge.node);
  return (
    <HorizontalGutter>
      <p>Replies: {comment.replyCount}</p>
      {replies && (
        <>
          {replies.map(reply => (
            <ConversationModalCommentContainer
              key={reply.id}
              comment={reply}
              isHighlighted={false}
              onUsernameClick={onUsernameClicked}
            />
          ))}
        </>
      )}
      {replies.length === 0 && comment.replyCount > 0 && (
        <Button variant="text" onClick={loadMore}>
          Show replies
        </Button>
      )}
      {comment.replyCount > replies.length && replies.length > 0 && (
        <Button variant="text" onClick={loadMore}>
          Show more replies
        </Button>
      )}
    </HorizontalGutter>
  );
};

// TODO: (cvle) If this could be autogenerated.
type FragmentVariables = Omit<
  ConversationModalRepliesContainerPaginationQueryVariables,
  "commentID"
>;

const enhanced = withPaginationContainer<
  Props,
  ConversationModalRepliesContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment ConversationModalRepliesContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 1 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ConversationModalReplies_replies") {
          edges {
            node {
              id
              ...ConversationModalCommentContainer_comment
            }
          }
        }
        replyCount
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.comment && props.comment.replies;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        commentID: props.comment.id,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ConversationModalRepliesContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          ...ConversationModalRepliesContainer_comment
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(ConversationModalRepliesContainer);

export default enhanced;
