import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { BanUserMutation as MutationTypes } from "talk-admin/__generated__/BanUserMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

let clientMutationId = 0;

const BanUserMutation = createMutation(
  "banUser",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation BanUserMutation($input: BanUserInput!) {
          banUser(input: $input) {
            user {
              id
              status {
                banned {
                  active
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
          clientMutationId: clientMutationId.toString(),
        },
      },
      optimisticResponse: {
        banUser: {
          user: {
            id: input.userID,
            status: {
              banned: {
                active: true,
              },
            },
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default BanUserMutation;
