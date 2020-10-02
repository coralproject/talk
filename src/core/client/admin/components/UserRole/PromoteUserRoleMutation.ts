import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { PromoteUserRoleMutation as MutationTypes } from "coral-admin/__generated__/PromoteUserRoleMutation.graphql";

let clientMutationId = 0;

const PromoteUserRoleMutation = createMutation(
  "updateUserModerationScopes",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation PromoteUserRoleMutation($input: PromoteUserRoleInput!) {
          promoteUserRole(input: $input) {
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

export default PromoteUserRoleMutation;
