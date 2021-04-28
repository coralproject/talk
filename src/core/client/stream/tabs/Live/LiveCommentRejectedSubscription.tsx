import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";

import { LiveCommentRejectedSubscription } from "coral-stream/__generated__/LiveCommentRejectedSubscription.graphql";

type StatusChangedVariables = SubscriptionVariables<
  LiveCommentRejectedSubscription
>;

const LiveCommentRejectedSubscription = createSubscription(
  "subscribeToCommentRejected",
  (environment: Environment, variables: StatusChangedVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveCommentRejectedSubscription($storyID: ID!) {
          commentRejected(storyID: $storyID) {
            commentID
          }
        }
      `,
      variables: {
        storyID: variables.storyID,
      },
      updater: (store) => {
        const root = store.getRootField("commentRejected");
        if (!root) {
          return;
        }

        const commentID = root.getValue("commentID") as string;

        if (!commentID) {
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

        comment.setValue(GQLCOMMENT_STATUS.REJECTED, "status");
      },
    });
  }
);

export default LiveCommentRejectedSubscription;
