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

import { RemoveUserWarningMutation as MutationTypes } from "coral-admin/__generated__/RemoveUserWarningMutation.graphql";

let clientMutationId = 0;

const RemoveUserWarningMutation = createMutation(
  "removeUserWarning",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    const now = new Date();
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RemoveUserWarningMutation($input: RemoveUserWarningInput!) {
          removeUserWarning(input: $input) {
            user {
              id
              status {
                current
                warning {
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
        removeUserWarning: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.filter((s) => s !== GQLUSER_STATUS.WARNED),
              warning: {
                active: false,
                history: [
                  {
                    active: false,
                    createdBy: {
                      id: viewer.id,
                      username: viewer.username || null,
                    },
                    createdAt: now.toISOString(),
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

export default RemoveUserWarningMutation;
