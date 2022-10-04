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
                }
              }
              membershipScopes {
                scoped
                sites {
                  id
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
              scoped: !!input.siteIDs?.length,
              sites: input.siteIDs?.map((id) => ({ id })) || [],
            },
            membershipScopes: {
              scoped: !!input.siteIDs?.length,
              sites: input.siteIDs?.map((id) => ({ id })) || [],
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
