import { graphql, requestSubscription } from "react-relay";
import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { CommentReplyCreatedSubscription } from "coral-stream/__generated__/CommentReplyCreatedSubscription.graphql";

function determineDepth(comment: RecordProxy) {
  let depth = 0;
  let cur: RecordProxy | null = comment;
  while (cur) {
    cur = cur.getLinkedRecord("parent");
    if (cur) {
      depth++;
    }
  }
  return depth;
}

const CommentReplyCreatedSubscription = createSubscription(
  "subscribeToCommentCreated",
  (
    environment: Environment,
    variables: SubscriptionVariables<CommentReplyCreatedSubscription> & {
      liveDirectRepliesInsertion?: boolean;
    }
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription CommentReplyCreatedSubscription($ancestorID: ID!) {
          commentReplyCreated(ancestorID: $ancestorID) {
            comment {
              id
              createdAt
              parent {
                id
              }
              ...AllCommentsTabContainer_comment
            }
          }
        }
      `,
      variables,
      updater: store => {
        const rootField = store.getRootField("commentReplyCreated");
        if (!rootField) {
          return;
        }
        const comment = rootField.getLinkedRecord("comment")!;
        comment.setValue(true, "enteredLive");

        const parentProxy = store.get(
          comment.getLinkedRecord("parent")!.getValue("id")!
        )!;

        const depth = determineDepth(comment);
        // Comment is just outside our visible depth.
        if (depth === 6) {
          // Inform last comment in visible tree about the available replies.
          // This will trigger to show the `Read More of this Conversation` link.
          const replyCount = parentProxy.getValue("replyCount") || 0;
          parentProxy.setValue(replyCount + 1, "replyCount");
          store.delete(comment.getDataID());
          return;
        }

        const connectionKey = "ReplyList_replies";
        const filters = { orderBy: "CREATED_AT_ASC" };
        const connection = ConnectionHandler.getConnection(
          parentProxy,
          connectionKey,
          filters
        );
        if (!connection) {
          // If it has no connection, it could not have been
          // in our visible tree.
          store.delete(parentProxy.getDataID());
          store.delete(comment.getDataID());
          return;
        }
        const commentsEdge = store.create(
          `edge-${comment.getValue("id")!}`,
          "CommentsEdge"
        );
        commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
        commentsEdge.setLinkedRecord(comment, "node");
        if (
          parentProxy.getValue("id") === variables.ancestorID &&
          variables.liveDirectRepliesInsertion
        ) {
          ConnectionHandler.insertEdgeAfter(connection, commentsEdge);
        } else {
          const linked = connection.getLinkedRecords("viewNewEdges") || [];
          connection.setLinkedRecords(
            linked.concat(commentsEdge),
            "viewNewEdges"
          );
        }
      },
    })
);

export default CommentReplyCreatedSubscription;
