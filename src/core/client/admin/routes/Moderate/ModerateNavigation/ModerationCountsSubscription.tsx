import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { ModerationCountsSubscription } from "coral-admin/__generated__/ModerationCountsSubscription.graphql";

const ModerationCountsSubscription = createSubscription(
  "subscribeToCounts",
  (
    environment: Environment,
    variables: SubscriptionVariables<ModerationCountsSubscription>
  ) => ({
    subscription: graphql`
      subscription ModerationCountsSubscription($storyID: ID) {
        commentEnteredModerationQueue(storyID: $storyID) {
          queue
        }
        commentLeftModerationQueue(storyID: $storyID) {
          queue
        }
      }
    `,
    variables,
    updater: (store) => {
      let queue: string;
      let change: number;

      const enteredRoot = store.getRootField("commentEnteredModerationQueue");
      const leftRoot = store.getRootField("commentLeftModerationQueue");
      if (enteredRoot) {
        queue = enteredRoot.getValue("queue") as string;
        change = +1;
      } else if (leftRoot) {
        queue = leftRoot.getValue("queue") as string;
        change = -1;
      } else {
        throw new Error("Expected a subscription result");
      }

      const moderationQueuesProxy = store
        .getRoot()
        .getLinkedRecord("moderationQueues", { storyID: variables.storyID })!;
      if (!moderationQueuesProxy) {
        return;
      }
      const queueProxy = moderationQueuesProxy.getLinkedRecord(
        queue!.toLocaleLowerCase()
      );
      if (!queueProxy) {
        return;
      }
      queueProxy.setValue(
        (queueProxy.getValue("count") as number) + change,
        "count"
      );
    },
  })
);

export default ModerationCountsSubscription;
