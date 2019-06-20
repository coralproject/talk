import { graphql, requestSubscription } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { QueueCommentLeftSubscription } from "coral-admin/__generated__/QueueCommentLeftSubscription.graphql";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

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
      },
    })
);

export default QueueSubscription;
