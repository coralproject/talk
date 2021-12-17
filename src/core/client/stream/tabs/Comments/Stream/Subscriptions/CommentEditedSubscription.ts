import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { CommentEditedSubscription } from "coral-stream/__generated__/CommentEditedSubscription.graphql";

type CommentEditedVariables = SubscriptionVariables<CommentEditedSubscription>;

const CommentEditedSubscription = createSubscription(
  "subscribeToCommentEdited",
  (environment: Environment, variables: CommentEditedVariables) => ({
    subscription: graphql`
      subscription CommentEditedSubscription($storyID: ID!) {
        commentEdited(storyID: $storyID) {
          comment {
            body
            editing {
              edited
            }
            revision {
              id
            }
          }
        }
      }
    `,
    variables: {
      storyID: variables.storyID,
    },
    updater: (store) => {
      // Relay will handle this cause we pulled the body
    },
  })
);

export default CommentEditedSubscription;
