import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { RemoveUserBanMutation as MutationTypes } from "coral-admin/__generated__/RemoveUserBanMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";

let clientMutationId = 0;

const RemoveUserBanMutation = createMutation(
  "removeUserBan",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RemoveUserBanMutation($input: RemoveUserBanInput!) {
          removeUserBan(input: $input) {
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
        removeUserBan: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.filter(s => s !== GQLUSER_STATUS.BANNED),
              ban: {
                active: false,
                history: [],
              },
            },
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default RemoveUserBanMutation;
