import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { CommentLeftModerationSubscription } from "coral-admin/__generated__/CommentLeftModerationSubscription.graphql";

const CommentLeftModerationSubscription = createSubscription(
  "subscribeToCounts",
  (
    environment: Environment,
    variables: SubscriptionVariables<CommentLeftModerationSubscription>
  ) => ({
    subscription: graphql`
      subscription CommentLeftModerationSubscription($storyID: ID) {
        commentLeftModerationQueue(storyID: $storyID) {
          queue
        }
      }
    `,
    variables,
    updater: (store) => {
      let queue: string;
      let change: number;

      const leftRoot = store.getRootField("commentLeftModerationQueue");
      if (leftRoot) {
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

export default CommentLeftModerationSubscription;
