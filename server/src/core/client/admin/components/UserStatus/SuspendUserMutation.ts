import { DateTime } from "luxon";
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

import { SuspendUserMutation as MutationTypes } from "coral-admin/__generated__/SuspendUserMutation.graphql";

let clientMutationId = 0;

const SuspendUserMutation = createMutation(
  "suspendUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    const now = new Date();
    const finish = DateTime.fromJSDate(now).plus({
      seconds: input.timeout,
    });
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation SuspendUserMutation($input: SuspendUserInput!) {
          suspendUser(input: $input) {
            user {
              id
              status {
                current
                suspension {
                  active
                  history {
                    active
                    createdAt
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
        suspendUser: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.concat(GQLUSER_STATUS.SUSPENDED),
              suspension: {
                active: true,
                history: [
                  {
                    active: true,
                    from: {
                      start: now.toISOString(),
                      finish: finish.toISODate(),
                    },
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

export default SuspendUserMutation;
