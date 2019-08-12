import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateUsernameMutation as MutationTypes } from "coral-stream/__generated__/UpdateUsernameMutation.graphql";

let clientMutationId = 0;

const UpdateUsernameMutation = createMutation(
  "updateUsername",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateUsernameMutation($input: UpdateUsernameInput!) {
          updateUsername(input: $input) {
            clientMutationId
            user {
              username
              status {
                username {
                  history {
                    username
                    createdAt
                  }
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
      optimisticResponse: {
        updateUsername: {
          clientMutationId: (clientMutationId++).toString(),
          user: {
            username: input.username,
            status: {
              username: {
                // FIXME: (tessalt) merge in existing history
                history: [
                  {
                    username: input.username,
                    createdAt: Date.now(),
                  },
                ],
              },
            },
          },
        },
      },
    })
);

export default UpdateUsernameMutation;
