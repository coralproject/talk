import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLCOMMENT_SORT_RL } from "coral-framework/schema";

import { CommentReleasedSubscription } from "coral-stream/__generated__/CommentReleasedSubscription.graphql";

function updateForNewestFirst(
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string
) {
  const rootField = store.getRootField("commentReleased");
  if (!rootField) {
    return;
  }

  const comment = rootField.getLinkedRecord("comment");
  if (!comment) {
    return;
  }

  const commentID = comment.getValue("id");
  if (!commentID || typeof commentID !== "string") {
    return;
  }

  const story = store.get(storyID);
  if (!story) {
    return;
  }

  const connection = ConnectionHandler.getConnection(story, "Stream_comments", {
    orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
  });
  if (!connection) {
    return;
  }

  comment.setValue(true, "enteredLive");

  const commentsEdge = store.create(`edge-${commentID}`, "CommentsEdge");
  commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
  commentsEdge.setLinkedRecord(comment, "node");

  const linked = connection.getLinkedRecords("viewNewEdges") || [];
  connection.setLinkedRecords(linked.concat(commentsEdge), "viewNewEdges");
}

function updateForOldestFirst(
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string
) {
  const story = store.get(storyID);
  if (!story) {
    return;
  }

  const connection = ConnectionHandler.getConnection(story, "Stream_comments", {
    orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
  });
  if (!connection) {
    return;
  }

  const pageInfo = connection.getLinkedRecord("pageInfo");
  if (!pageInfo) {
    return;
  }

  pageInfo.setValue(true, "hasNextPage");
}

const CommentReleasedSubscription = createSubscription(
  "subscribeToCommentReleased",
  (
    environment: Environment,
    variables: SubscriptionVariables<CommentReleasedSubscription> & {
      orderBy: GQLCOMMENT_SORT_RL;
    }
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription CommentReleasedSubscription($storyID: ID!) {
          commentReleased(storyID: $storyID) {
            comment {
              id
              createdAt
              ...AllCommentsTabContainer_comment
            }
          }
        }
      `,
      variables,
      updater: (store) => {
        const rootField = store.getRootField("commentReleased");
        if (!rootField) {
          return;
        }
        const commentID = rootField.getLinkedRecord("comment")?.getValue("id");
        if (!commentID || typeof commentID !== "string") {
          return;
        }

        const commentInStore = Boolean(
          // We use store from environment here, because it does not contain the response data yet!
          environment.getStore().getSource().get(commentID)
        );
        if (commentInStore) {
          // Comment already in the queue, ignore it as it might be just expected race condition,
          // unless the server is sending the same response multiple times.
          return;
        }

        if (variables.orderBy === GQLCOMMENT_SORT.CREATED_AT_DESC) {
          updateForNewestFirst(store, variables.storyID);
          return;
        }
        if (variables.orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
          updateForOldestFirst(store, variables.storyID);
          return;
        }
        throw new Error(
          `Unsupport new top level comment live updates for sort ${variables.orderBy}`
        );
      },
    })
);

export default CommentReleasedSubscription;
