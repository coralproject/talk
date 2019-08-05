import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { RemoveUserSuspensionMutation as MutationTypes } from "coral-admin/__generated__/RemoveUserSuspensionMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";

let clientMutationId = 0;

const RemoveUserSuspensionMutation = createMutation(
  "removeUserSuspension",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RemoveUserSuspensionMutation(
          $input: RemoveUserSuspensionInput!
        ) {
          removeUserSuspension(input: $input) {
            user {
              id
              status {
                current
                suspension {
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
        removeUserSuspension: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.concat(GQLUSER_STATUS.SUSPENDED),
              suspension: {
                active: false,
              },
            },
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default RemoveUserSuspensionMutation;
