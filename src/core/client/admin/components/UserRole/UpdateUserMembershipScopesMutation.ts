import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateUserMembershipScopesMutation as MutationTypes } from "coral-admin/__generated__/UpdateUserMembershipScopesMutation.graphql";

let clientMutationId = 0;

const UpdateUserMembershipScopesMutation = createMutation(
  "updateUserMembership",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<any>(environment, {
      mutation: graphql`
        mutation UpdateUserMembershipScopesMutation(
          $input: UpdateUserMembershipScopesInput!
        ) {
          updateUserMembershipScopes(input: $input) {
            user {
              id
              role
              membershipScopes {
                scoped
                sites {
                  id
                  name
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UpdateUserMembershipScopesMutation;
