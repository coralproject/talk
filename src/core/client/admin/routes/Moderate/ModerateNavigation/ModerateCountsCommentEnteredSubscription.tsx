import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { ModerateCountsCommentEnteredSubscription } from "coral-admin/__generated__/ModerateCountsCommentEnteredSubscription.graphql";

import changeQueueCount from "./changeQueueCount";

const ModerateCountsCommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (
    environment: Environment,
    variables: SubscriptionVariables<ModerateCountsCommentEnteredSubscription>
  ) =>
    requestSubscription<ModerateCountsCommentEnteredSubscription>(environment, {
      subscription: graphql`
        subscription ModerateCountsCommentEnteredSubscription(
          $storyID: ID
          $siteID: ID
        ) {
          commentEnteredModerationQueue(storyID: $storyID, siteID: $siteID) {
            queue
          }
        }
      `,
      variables,
      updater: (store) => {
        const root = store.getRootField("commentEnteredModerationQueue")!;
        const queue = root.getValue("queue");
        const change = 1;
        changeQueueCount(store, change, queue, variables.storyID);
      },
    })
);

export default ModerateCountsCommentEnteredSubscription;
