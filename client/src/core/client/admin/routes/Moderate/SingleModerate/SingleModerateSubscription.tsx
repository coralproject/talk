import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { SingleModerateSubscription } from "coral-admin/__generated__/SingleModerateSubscription.graphql";

const SingleModerateSubscription = createSubscription(
  "subscribeToSingleModerate",
  (
    environment: Environment,
    variables: SubscriptionVariables<SingleModerateSubscription>
  ) => ({
    subscription: graphql`
      subscription SingleModerateSubscription($commentID: ID!) {
        commentStatusUpdated(id: $commentID) {
          comment {
            id
            status
            ...MarkersContainer_comment @relay(mask: false)
            ...ModeratedByContainer_comment @relay(mask: false)
          }
        }
      }
    `,
    variables,
    updater: (store) => {
      const comment = store
        .getRootField("commentStatusUpdated")!
        .getLinkedRecord("comment")!;
      if (comment) {
        // Mark that the status of the comment was live updated.
        comment.setValue(true, "statusLiveUpdated");
      }
    },
  })
);

export default SingleModerateSubscription;
