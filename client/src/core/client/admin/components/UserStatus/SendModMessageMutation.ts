import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { SendModMessageMutation as MutationTypes } from "coral-admin/__generated__/SendModMessageMutation.graphql";

let clientMutationId = 0;

const SendModMessageMutation = createMutation(
  "sendModMessage",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    const now = new Date();
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation SendModMessageMutation($input: SendModMessageInput!) {
          sendModMessage(input: $input) {
            user {
              id
              status {
                modMessage {
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
          userID: input.userID,
          message: input.message,
          clientMutationId: clientMutationId.toString(),
        },
      },
      optimisticResponse: {
        sendModMessage: {
          user: {
            id: input.userID,
            status: {
              modMessage: {
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

export default SendModMessageMutation;
