import { graphql, requestSubscription } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLMODERATION_QUEUE_RL } from "coral-framework/schema";

import { QueueCommentLeftSubscription } from "coral-admin/__generated__/QueueCommentLeftSubscription.graphql";

function handleCommentLeftModerationQueue(
  store: RecordSourceSelectorProxy,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null
) {
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
  const connection = getQueueConnection(store, queue, storyID);
  if (connection) {
    const linked = connection.getLinkedRecords("viewNewEdges") || [];
    connection.setLinkedRecords(
      linked.filter(
        r => r!.getLinkedRecord("node")!.getValue("id") !== commentID
      ),
      "viewNewEdges"
    );
  }
}

const QueueSubscription = createSubscription(
  "subscribeToQueueCommentLeft",
  (
    environment: Environment,
    variables: SubscriptionVariables<QueueCommentLeftSubscription>
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription QueueCommentLeftSubscription(
          $storyID: ID
          $queue: MODERATION_QUEUE!
        ) {
          commentLeftModerationQueue(storyID: $storyID, queue: $queue) {
            comment {
              id
              status
              ...MarkersContainer_comment @relay(mask: false)
              ...ModeratedByContainer_comment @relay(mask: false)
            }
          }
        }
      `,
      variables,
      updater: store => {
        handleCommentLeftModerationQueue(
          store,
          variables.queue,
          variables.storyID || null
        );
      },
    })
);

export default QueueSubscription;
