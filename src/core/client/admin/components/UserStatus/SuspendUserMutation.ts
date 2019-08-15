import { DateTime } from "luxon";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SuspendUserMutation as MutationTypes } from "coral-admin/__generated__/SuspendUserMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";

let clientMutationId = 0;

const SuspendUserMutation = createMutation(
  "suspendUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
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
                    from {
                      start
                      finish
                    }
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
                      start: now,
                      finish,
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

export default SuspendUserMutation;
