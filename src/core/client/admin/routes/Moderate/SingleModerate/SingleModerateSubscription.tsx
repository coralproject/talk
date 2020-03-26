import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { SingleModerateSubscription } from "coral-admin/__generated__/SingleModerateSubscription.graphql";

const SingleModerateSubscription = createSubscription(
  "subscribeToSingleModerate",
  (
    environment: Environment,
    variables: SubscriptionVariables<SingleModerateSubscription>
  ) =>
    requestSubscription(environment, {
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
        const commentID = store
          .getRootField("commentStatusUpdated")!
          .getLinkedRecord("comment")!
          .getValue("id")! as string;
        const commentInStore = store.get(commentID);
        if (commentInStore) {
          // Mark that the status of the comment was live updated.
          commentInStore.setValue(true, "statusLiveUpdated");
        }
      },
    })
);

export default SingleModerateSubscription;
