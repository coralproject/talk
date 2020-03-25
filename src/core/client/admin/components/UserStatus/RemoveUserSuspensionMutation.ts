import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { DeepWritable } from "coral-common/types";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";

import { RemoveUserSuspensionMutation as MutationTypes } from "coral-admin/__generated__/RemoveUserSuspensionMutation.graphql";

let clientMutationId = 0;

const RemoveUserSuspensionMutation = createMutation(
  "removeUserSuspension",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const user = lookup<GQLUser>(environment, input.userID)!;
    let newHistory: DeepWritable<
      MutationTypes["response"]["removeUserSuspension"]["user"]["status"]["suspension"]["history"]
    > = [];
    if (user.status.suspension.history) {
      newHistory = user.status.suspension.history.map((h) =>
        pick(h, [
          "active",
          "from.start",
          "from.finish",
          "createdBy.id",
          "createdBy.username",
        ])
      ) as any;
      newHistory[newHistory.length - 1].active = false;
      newHistory[newHistory.length - 1].from.finish = new Date().toISOString();
    }

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
                  history {
                    active
                    from {
                      start
                      finish
                    }
                    createdBy {
                      id
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
        removeUserSuspension: {
          user: {
            id: input.userID,
            status: {
              current: user.status.current.concat(GQLUSER_STATUS.SUSPENDED),
              suspension: {
                active: false,
                history: newHistory,
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
