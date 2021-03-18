import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT_RL } from "coral-framework/schema";
import {
  determineDepthTillAncestor,
  isPublished,
} from "coral-stream/tabs/shared/helpers";

import { LiveReplyCommentEnteredSubscription } from "coral-stream/__generated__/LiveReplyCommentEnteredSubscription.graphql";

function insertComment(
  store: RecordSourceSelectorProxy<unknown>,
  comment: RecordProxy,
  parent: RecordProxy | null,
  parentID: string,
  connectionKey: string
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

  const connection = ConnectionHandler.getConnection(parent, connectionKey);

  if (!connection) {
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

  ConnectionHandler.insertEdgeAfter(connection, commentsEdge);
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
            store,
            comment,
            parent,
            variables.parentID,
            variables.connectionKey
          );
        }
      },
    });
  }
);

export default LiveReplyCommentEnteredSubscription;
