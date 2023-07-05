import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";

import { RemoveUserPremodMutation as MutationTypes } from "coral-admin/__generated__/RemoveUserPremodMutation.graphql";

let clientMutationId = 0;

const RemoveUserPremodMutation = createMutation(
  "removeUserPremod",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RemoveUserPremodMutation($input: RemovePremodUserInput!) {
          removeUserPremod(input: $input) {
            user {
              id
              status {
                current
                premod {
                  active
                  history {
                    active
                    createdAt
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
        removeUserPremod: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.filter((s) => s !== GQLUSER_STATUS.PREMOD),
              premod: {
                active: false,
                history: [
                  {
                    active: false,
                    createdAt: new Date().toISOString(),
                    createdBy: {
                      id: viewer.id,
                      username: viewer.username || null,
                    },
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

export default RemoveUserPremodMutation;
