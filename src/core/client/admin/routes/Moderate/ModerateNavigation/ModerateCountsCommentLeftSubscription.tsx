import { graphql, requestSubscription } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLMODERATION_QUEUE } from "coral-framework/schema";

import { ModerateCountsCommentLeftSubscription } from "coral-admin/__generated__/ModerateCountsCommentLeftSubscription.graphql";

import changeQueueCount from "./changeQueueCount";

const ModerateCountsCommentLeftSubscription = createSubscription(
  "subscribeToCommentLeft",
  (
    environment: Environment,
    variables: SubscriptionVariables<ModerateCountsCommentLeftSubscription>
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription ModerateCountsCommentLeftSubscription($storyID: ID) {
          commentLeftModerationQueue(storyID: $storyID) {
            queue
          }
          commentLeftModerationQueue(storyID: $storyID) {
            queue
          }
        }
      `,
      variables,
      updater: store => {
        const root = store.getRootField("commentLeftModerationQueue")!;
        const queue = root.getValue("queue") as GQLMODERATION_QUEUE;
        const change = -1;
        changeQueueCount(store, change, queue, variables.storyID);
      },
    })
);

export default ModerateCountsCommentLeftSubscription;
