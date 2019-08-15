import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { BanUserMutation } from "coral-stream/__generated__/BanUserMutation.graphql";

let clientMutationId = 0;

const BanUserMutation = createMutation(
  "banUser",
  (environment: Environment, input: MutationInput<BanUserMutation>) => {
    return commitMutationPromiseNormalized<BanUserMutation>(environment, {
      mutation: graphql`
        mutation BanUserMutation($input: BanUserInput!) {
          banUser(input: $input) {
            user {
              id
              status {
                ban {
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
              ban: {
                active: true,
              },
            },
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default BanUserMutation;
