import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { UpdateUserRoleMutation as MutationTypes } from "talk-admin/__generated__/UpdateUserRoleMutation.graphql";

export type UpdateUserRoleInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation UpdateUserRoleMutation($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      user {
        role
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: UpdateUserRoleInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    optimisticResponse: {
      updateUserRole: {
        user: {
          id: input.userID,
          role: input.role,
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
    variables: {
      input: {
        ...input,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

export const withUpdateUserRoleMutation = createMutationContainer(
  "updateUserRole",
  commit
);

export type UpdateUserRoleMutation = (
  input: UpdateUserRoleInput
) => MutationResponsePromise<MutationTypes, "updateUserRole">;
