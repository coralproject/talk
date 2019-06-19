import { graphql, requestSubscription } from "react-relay";
import { Environment } from "relay-runtime";

import { QueueSubscription } from "coral-admin/__generated__/QueueSubscription.graphql";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

const QueueSubscription = createSubscription(
  "subscribeToQueue",
  (
    environment: Environment,
    variables: SubscriptionVariables<QueueSubscription>
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription QueueSubscription($storyID: ID, $queue: MODERATION_QUEUE) {
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
        const commentID = store
          .getRootField("commentLeftModerationQueue")!
          .getLinkedRecord("comment")!
          .getValue("id")!;
        const commentInStore = store.get(commentID);
        if (commentInStore) {
          // Mark that the status of the comment was live updated.
          commentInStore.setValue(true, "statusLiveUpdated");
        }
      },
    })
);

export default QueueSubscription;
