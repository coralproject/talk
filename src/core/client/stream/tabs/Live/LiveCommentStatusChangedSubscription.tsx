import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { LiveCommentStatusChangedSubscription } from "coral-stream/__generated__/LiveCommentStatusChangedSubscription.graphql";

type StatusChangedVariables = SubscriptionVariables<
  LiveCommentStatusChangedSubscription
>;

const LiveCommentStatusChangedSubscription = createSubscription(
  "subscribeToCommentStatusChanged",
  (environment: Environment, variables: StatusChangedVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveCommentStatusChangedSubscription($storyID: ID!) {
          commentStatusChanged(storyID: $storyID) {
            newStatus
            oldStatus
            commentID
          }
        }
      `,
      variables: {
        storyID: variables.storyID,
      },
      updater: (store) => {
        const root = store.getRootField("commentStatusChanged");
        if (!root) {
          return;
        }

        const commentID = root.getValue("commentID") as string;
        const newStatus = root.getValue("newStatus");

        if (!commentID) {
          return;
        }
        if (!newStatus) {
          return;
        }
        const comment = store.get(commentID);
        if (!comment) {
          return;
        }
        const story = comment.getLinkedRecord("story");
        if (!story) {
          return;
        }
        const storyID = story.getValue("id");
        if (storyID !== variables.storyID) {
          return;
        }

        comment.setValue(newStatus, "status");
      },
    });
  }
);

export default LiveCommentStatusChangedSubscription;
