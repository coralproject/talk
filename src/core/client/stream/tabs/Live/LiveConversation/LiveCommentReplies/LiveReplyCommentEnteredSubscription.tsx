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
import { GQLCOMMENT_SORT_RL } from "coral-framework/schema";
import {
  determineDepthTillAncestor,
  isPublished,
} from "coral-stream/tabs/shared/helpers";

import { LiveReplyCommentEnteredSubscription } from "coral-stream/__generated__/LiveReplyCommentEnteredSubscription.graphql";

function liveInsertionEnabled(environment: Environment): boolean {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.tailingConversation;
}

function insertComment(
  environment: Environment,
  store: RecordSourceSelectorProxy<unknown>,
  parentID: string,
  parent: RecordProxy | null,
  comment: RecordProxy
) {
  if (!parent) {
    return;
  }

  const pID = parent.getValue("id")! as string;
  // Wrong reply stream, bail out
  if (parentID !== pID) {
    return;
  }

  const depth = determineDepthTillAncestor(comment, parentID);
  if (depth && depth > 1) {
    return;
  }

  const afterConnection = ConnectionHandler.getConnection(
    parent,
    "Replies_after"
  );
  if (!afterConnection) {
    return;
  }

  const beforeConnection = ConnectionHandler.getConnection(
    parent,
    "Replies_before"
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
  SubscriptionVariables<LiveReplyCommentEnteredSubscription>,
  "flattenReplies"
> & {
  /** orderBy that was supplied to the `comments` connection on Story */
  orderBy?: GQLCOMMENT_SORT_RL;
  /** Tag that was supplied to the `comments` connection on Story */
  tag?: string;
  /** If set together with ancestorID, direct replies to the ancestor will immediately displayed */
  liveDirectRepliesInsertion?: boolean;
  /** The relay connection key to find the commments on the story */
  connectionKey: string;
  /** The parent ID we are listening to replies for */
  parentID: string;
};

const LiveReplyCommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveReplyCommentEnteredSubscription(
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

        const status = comment.getValue("status");
        // If comment is not visible, we don't need to add it.
        if (!isPublished(status)) {
          return;
        }

        const parent = comment.getLinkedRecord("parent");
        const isTopLevelComent = !parent;

        if (isTopLevelComent) {
          // we only do replies here
          return;
        } else {
          comment.setValue(true, "enteredLive");
          insertComment(
            environment,
            store,
            variables.parentID,
            parent,
            comment
          );
        }
      },
    });
  }
);

export default LiveReplyCommentEnteredSubscription;
