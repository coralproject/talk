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
        mutation UpdateUserRoleMutation($input: UpdateUserRoleInput!)
          @raw_response_type {
          updateUserRole(input: $input) {
            user {
              id
              role
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
