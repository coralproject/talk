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

import { WarnUserMutation as MutationTypes } from "coral-admin/__generated__/WarnUserMutation.graphql";

let clientMutationId = 0;

const WarnUserMutation = createMutation(
  "warnUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    const now = new Date();
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation WarnUserMutation($input: WarnUserInput!) {
          warnUser(input: $input) {
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
        warnUser: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.concat(GQLUSER_STATUS.WARNED),
              warning: {
                active: true,
                history: [
                  {
                    active: true,
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

export default WarnUserMutation;
