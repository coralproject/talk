import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  LOCAL_ID,
  lookup,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { LiveCommentEnteredSubscription } from "coral-stream/__generated__/LiveCommentEnteredSubscription.graphql";

import { isPublished } from "../shared/helpers";

function liveInsertionEnabled(environment: Environment): boolean {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.tailing;
}

function insertComment(
  environment: Environment,
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string,
  comment: RecordProxy
) {
  const story = store.get(storyID)!;
  const afterConnection = ConnectionHandler.getConnection(story, "Chat_after");
  if (!afterConnection) {
    return;
  }

  const beforeConnection = ConnectionHandler.getConnection(
    story,
    "Chat_before"
  );

  const liveInsertion = liveInsertionEnabled(environment);

  if (liveInsertion) {
    const edge = ConnectionHandler.createEdge(store, comment, comment, "");
    edge.setValue(comment.getValue("createdAt"), "cursor");

    ConnectionHandler.insertEdgeAfter(afterConnection, edge);
  } else {
    const pageInfoAfter = afterConnection.getLinkedRecord("pageInfo")!;
    // Should not be falsy because Relay uses this information to determine
    // whether or not new data is available to load.
    if (!pageInfoAfter.getValue("endCursor")) {
      const beforeEdges = beforeConnection
        ? beforeConnection.getLinkedRecords("edges")!
        : [];
      const endCursor =
        beforeEdges.length > 0
          ? beforeEdges[0].getValue("cursor")
          : new Date(0).toISOString();
      // Set cursor to oldest date, to load from the beginning.
      pageInfoAfter.setValue(endCursor, "endCursor");
    }
    pageInfoAfter.setValue(true, "hasNextPage");
  }
}

type CommentEnteredVariables = Omit<
  SubscriptionVariables<LiveCommentEnteredSubscription>,
  "flattenReplies"
>;

const LiveCommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveCommentEnteredSubscription(
          $storyID: ID!
          $ancestorID: ID
        ) {
          commentEntered(storyID: $storyID, ancestorID: $ancestorID) {
            comment {
              id
              createdAt
              status
              parent {
                id
              }
              tags {
                code
              }
              ...LiveCommentContainer_comment
            }
          }
        }
      `,
      variables: {
        storyID: variables.storyID,
        ancestorID: variables.ancestorID,
      },
      updater: (store) => {
        const rootField = store.getRootField("commentEntered");
        if (!rootField) {
          return;
        }

        const comment = rootField.getLinkedRecord("comment")!;
        const commentID = comment.getValue("id")! as string;

        const status = comment.getValue("status");

        const commentInStore = Boolean(
          // We use store from environment here, because it does not contain the response data yet!
          environment.getStore().getSource().get(commentID)
        );
        if (commentInStore) {
          // Comment already in the queue, ignore it as it might be just expected race condition,
          // unless the server is sending the same response multiple times.
          return;
        }
        // If comment is not visible, we don't need to add it.
        if (!isPublished(status)) {
          return;
        }

        comment.setValue(true, "enteredLive");
        insertComment(environment, store, variables.storyID, comment);
      },
    });
  }
);

export default LiveCommentEnteredSubscription;
