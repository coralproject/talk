import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

let clientMutationId = 0;

const UpdateUserMembershipMutation = createMutation(
  "updateUserMembership",
  (environment: Environment, input: MutationInput<any>) =>
    commitMutationPromiseNormalized<any>(environment, {
      mutation: graphql`
        mutation UpdateUserMembershipMutation($input: UpdateUserMembershipInput!) {
          updateUserMembership(input: $input) {
            user {
              id
              role
            }
            clientMutationId
          }
        }
      `,
      optimisticResponse: {
        updateUserMembership: {
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

export default UpdateUserMembershipMutation;
