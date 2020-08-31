import { graphql } from "react-relay";
import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { CommentReplyCreatedSubscription } from "coral-stream/__generated__/CommentReplyCreatedSubscription.graphql";

/**
 * Returns depth until ancestor.
 */
function determineDepthTillAncestor(comment: RecordProxy, ancestorID: string) {
  let depth = 0;
  let cur: RecordProxy | null | undefined = comment;
  while (cur) {
    cur = cur.getLinkedRecord("parent");
    if (cur) {
      depth++;
      // Stop when reaching base ancestor.
      if (cur.getValue("id") === ancestorID) {
        return depth;
      }
    }
  }
  return null;
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
      updater: (store) => {
        const rootField = store.getRootField("commentReplyCreated");
        if (!rootField) {
          return;
        }
        const comment = rootField.getLinkedRecord("comment")!;
        const commentInStore = Boolean(
          // We use store from environment here, because it does not contain the response data yet!
          environment
            .getStore()
            .getSource()
            .get(comment.getValue("id") as string)
        );
        if (commentInStore) {
          return;
        }

        comment.setValue(true, "enteredLive");

        const parentID = comment
          .getLinkedRecord("parent")!
          .getValue("id")! as string;
        const parentProxy = store.get(parentID)!;

        const depth = determineDepthTillAncestor(comment, variables.ancestorID);
        if (depth === null) {
          // could not trace back to ancestor, discard.
          return;
        }

        // Comment is just outside our visible depth.
        if (depth >= 4) {
          // Inform last comment in visible tree about the available replies.
          // This will trigger to show the `Read More of this Conversation` link.
          const replyCount = parentProxy.getValue("replyCount") || 0;
          parentProxy.setValue((replyCount as number) + 1, "replyCount");
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
          return;
        }
        if (connection.getLinkedRecord("pageInfo")!.getValue("hasNextPage")) {
          // It hasn't loaded all comments yet, ignore this one.
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
