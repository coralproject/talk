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

import { PremodUserMutation as MutationTypes } from "coral-admin/__generated__/PremodUserMutation.graphql";

let clientMutationId = 0;

const PremodUserMutation = createMutation(
  "premodUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation PremodUserMutation($input: PremodUserInput!) {
          premodUser(input: $input) {
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
        premodUser: {
          user: {
            id: input.userID,
            status: {
              current: lookup<GQLUser>(
                environment,
                input.userID
              )!.status.current.concat(GQLUSER_STATUS.PREMOD),
              premod: {
                active: true,
                history: [
                  {
                    active: true,
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

export default PremodUserMutation;
