import { graphql } from "react-relay";
import { commitLocalUpdate, Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateUserBanMutation as QueryTypes } from "coral-admin/__generated__/UpdateUserBanMutation.graphql";
let clientMutationId = 0;

const UpdateUserBanMutation = createMutation(
  "updateUserBan",
  (environment: Environment, input: MutationInput<QueryTypes>) => {
    const {
      userID,
      banSiteIDs,
      unbanSiteIDs,
      message,
      rejectExistingComments,
    } = input;
    if (input.rejectExistingComments) {
      commitLocalUpdate(environment, (store) => {
        const record = store.get(input.userID);
        return record!.setValue(banSiteIDs, "commentsRejectedOnSites");
      });
    }
    return commitMutationPromiseNormalized(environment, {
      mutation: graphql`
        mutation UpdateUserBanMutation($input: UpdateUserBanInput!) {
          updateUserBan(input: $input) {
            user {
              id
              status {
                current
                ban {
                  active
                  sites {
                    id
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          userID,
          banSiteIDs,
          unbanSiteIDs,
          message,
          rejectExistingComments,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default UpdateUserBanMutation;
