import { graphql, requestSubscription } from "react-relay";
import { Environment } from "relay-runtime";

import { SingleModerateSubscription } from "coral-admin/__generated__/SingleModerateSubscription.graphql";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

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
              statusHistory(first: 1) {
                edges {
                  node {
                    moderator {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables,
      updater: store => {
        const commentID = store
          .getRootField("commentStatusUpdated")!
          .getLinkedRecord("comment")!
          .getValue("id")!;
        const commentInStore = store.get(commentID);
        if (commentInStore) {
          // Mark that the status of the comment was live updated.
          commentInStore.setValue(true, "statusLiveUpdated");
        }
      },
    })
);

export default SingleModerateSubscription;
