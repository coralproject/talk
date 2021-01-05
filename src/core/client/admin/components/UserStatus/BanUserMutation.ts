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

import { BanUserMutation as MutationTypes } from "coral-admin/__generated__/BanUserMutation.graphql";

let clientMutationId = 0;

const BanUserMutation = createMutation(
  "banUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation BanUserMutation($input: BanUserInput!) {
          banUser(input: $input) {
            user {
              id
              status {
                current
                warning {
                  active
                }
                premod {
                  active
                }
                suspension {
                  active
                }
                ban {
                  active
                  history {
                    active
                    createdAt
                    createdBy {
                      id
                      username
                    }
                  }
                  sites {
                    id
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
                    createdAt: new Date().toISOString(),
                    createdBy: {
                      id: viewer.id,
                      username: viewer.username || null,
                    },
                  },
                ],
                sites:
                  input.siteIDs?.map((id) => {
                    return { id };
                  }) || [],
              },
              warning: {
                active: false,
              },
              suspension: {
                active: false,
              },
              premod: {
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

export default BanUserMutation;
