import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { BanUserMutation as MutationTypes } from "coral-admin/__generated__/BanUserMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";

let clientMutationId = 0;

const BanUserMutation = createMutation(
  "banUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation BanUserMutation($input: BanUserInput!) {
          banUser(input: $input) {
            user {
              id
              status {
                current
                ban {
                  active
                  history {
                    active
                    createdAt
                    createdBy {
                      username
                    }
                  }
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
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.concat(GQLUSER_STATUS.BANNED),
              ban: {
                active: true,
                history: [
                  {
                    active: true,
                    createdAt: new Date(),
                  },
                ],
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
