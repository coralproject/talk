import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { LiveCommentEditedSubscription } from "coral-stream/__generated__/LiveCommentEditedSubscription.graphql";

type CommentEditedVariables = Omit<
  SubscriptionVariables<LiveCommentEditedSubscription>,
  "flattenReplies"
>;

const LiveCommentEditedSubscription = createSubscription(
  "subscribeToCommentEdited",
  (environment: Environment, variables: CommentEditedVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveCommentEditedSubscription($storyID: ID!) {
          commentEdited(storyID: $storyID) {
            comment {
              id
              createdAt
              status
              parent {
                id
              }
              tags {
                code
              }
              ...LiveCommentContainer_comment
            }
          }
        }
      `,
      variables: {
        storyID: variables.storyID,
      },
      updater: () => {
        // relay will handle this
      },
    });
  }
);

export default LiveCommentEditedSubscription;
