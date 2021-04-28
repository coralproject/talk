import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

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
            comment {
              status
            }
          }
        }
      `,
      variables: {
        storyID: variables.storyID,
      },
      updater: (store) => {
        // Relay will do this for us since we grabbed the status
      },
    });
  }
);

export default LiveCommentRejectedSubscription;
