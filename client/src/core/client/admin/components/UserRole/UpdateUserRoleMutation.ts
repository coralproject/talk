import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateUserRoleMutation as MutationTypes } from "coral-admin/__generated__/UpdateUserRoleMutation.graphql";

let clientMutationId = 0;

const UpdateUserRoleMutation = createMutation(
  "updateUserRole",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateUserRoleMutation($input: UpdateUserRoleInput!) {
          updateUserRole(input: $input) {
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
              membershipScopes {
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
      optimisticResponse: {
        updateUserRole: {
          user: {
            id: input.userID,
            role: input.role,
            moderationScopes: {
              scoped: !!input.scoped,
              sites: [],
            },
            membershipScopes: {
              scoped: input.scoped,
              sites: [],
            },
          },
          clientMutationId: clientMutationId.toString(),
        },
      },
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UpdateUserRoleMutation;
