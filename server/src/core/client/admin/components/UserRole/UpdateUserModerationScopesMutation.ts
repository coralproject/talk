import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateUserModerationScopesMutation as MutationTypes } from "coral-admin/__generated__/UpdateUserModerationScopesMutation.graphql";

let clientMutationId = 0;

const UpdateUserModerationScopesMutation = createMutation(
  "updateUserModerationScopes",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateUserModerationScopesMutation(
          $input: UpdateUserModerationScopesInput!
        ) {
          updateUserModerationScopes(input: $input) {
            user {
              id
              role
              moderationScopes {
                scoped
                sites {
                  id
                  name
                }
              }
            }
            clientMutationId
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

export default UpdateUserModerationScopesMutation;
