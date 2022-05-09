import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { BanUserEvent } from "coral-stream/events";

import { BanUserMutation } from "coral-stream/__generated__/BanUserMutation.graphql";

let clientMutationId = 0;

const BanUserMutation = createMutation(
  "banUser",
  async (
    environment: Environment,
    input: MutationInput<BanUserMutation> & { commentID: string },
    { eventEmitter }: CoralContext
  ) => {
    const banUserEvent = BanUserEvent.begin(eventEmitter, {
      commentID: input.commentID,
      userID: input.userID,
    });
    try {
      const result = await commitMutationPromiseNormalized<BanUserMutation>(
        environment,
        {
          mutation: graphql`
            mutation BanUserMutation($input: BanUserInput!) {
              banUser(input: $input) {
                user {
                  id
                  status {
                    ban {
                      active
                      sites {
                        id
                      }
                    }
                    suspension {
                      active
                    }
                    warning {
                      active
                    }
                    premod {
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
              userID: input.userID,
              message: input.message,
              rejectExistingComments: input.rejectExistingComments,
              siteIDs: input.siteIDs,
              clientMutationId: clientMutationId.toString(),
            },
          },
          optimisticResponse: {
            banUser: {
              user: {
                id: input.userID,
                status: {
                  ban: {
                    active: true,
                    sites:
                      input.siteIDs?.map((id) => {
                        return { id };
                      }) || [],
                  },
                  suspension: {
                    active: false,
                  },
                  warning: {
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
        }
      );
      banUserEvent.success();
      return result;
    } catch (error) {
      banUserEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default BanUserMutation;
