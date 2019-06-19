import { graphql, requestSubscription } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { QueueSubscription } from "coral-admin/__generated__/QueueSubscription.graphql";
import { getQueueConnection } from "coral-admin/helpers";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLMODERATION_QUEUE_RL } from "coral-framework/schema";

function handleCommentLeftModerationQueue(store: RecordSourceSelectorProxy) {
  const rootField = store.getRootField("commentLeftModerationQueue");
  if (!rootField) {
    return;
  }
  const commentID = rootField.getLinkedRecord("comment")!.getValue("id")!;
  const commentInStore = store.get(commentID);
  if (commentInStore) {
    // Mark that the status of the comment was live updated.
    commentInStore.setValue(true, "statusLiveUpdated");
  }
}

function handleCommentEnteredModerationQueue(
  store: RecordSourceSelectorProxy,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null
) {
  const rootField = store.getRootField("commentEnteredModerationQueue");
  if (!rootField) {
    return;
  }
  const comment = rootField.getLinkedRecord("comment")!;
  comment.setValue(true, "enteredLive");
  const commentsEdge = store.create(
    `edge-${comment.getValue("id")!}`,
    "CommentsEdge"
  );
  commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
  commentsEdge.setLinkedRecord(comment, "node");
  const connection = getQueueConnection(store, queue, storyID);
  if (connection) {
    const linked = connection.getLinkedRecords("viewMoreEdges") || [];
    connection.setLinkedRecords(linked.concat(commentsEdge), "viewMoreEdges");
  }
}

const QueueSubscription = createSubscription(
  "subscribeToQueue",
  (
    environment: Environment,
    variables: SubscriptionVariables<QueueSubscription>
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription QueueSubscription(
          $storyID: ID
          $queue: MODERATION_QUEUE!
        ) {
          commentEnteredModerationQueue(storyID: $storyID, queue: $queue) {
            comment {
              id
              createdAt
              ...ModerateCardContainer_comment
            }
          }
          commentLeftModerationQueue(storyID: $storyID, queue: $queue) {
            comment {
              id
              status
              statusHistory(first: 1) {
                edges {
                  node {
                    moderator {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables,
      updater: store => {
        handleCommentLeftModerationQueue(store);
        handleCommentEnteredModerationQueue(
          store,
          variables.queue,
          variables.storyID || null
        );
      },
    })
);

export default QueueSubscription;
