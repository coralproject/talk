import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { ChangeUsernameEvent } from "coral-stream/events";

import { UpdateUsernameMutation as MutationTypes } from "coral-stream/__generated__/UpdateUsernameMutation.graphql";

let clientMutationId = 0;

const UpdateUsernameMutation = createMutation(
  "updateUsername",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const changeUsernameEvent = ChangeUsernameEvent.begin(eventEmitter, {
      oldUsername: getViewer(environment)!.username!,
      newUsername: input.username,
    });
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UpdateUsernameMutation($input: UpdateUsernameInput!) {
              updateUsername(input: $input) {
                clientMutationId
                user {
                  id
                  username
                  status {
                    username {
                      history {
                        username
                        createdAt
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              ...input,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
          optimisticResponse: {
            updateUsername: {
              clientMutationId: (clientMutationId++).toString(),
              user: {
                id: getViewer(environment)!.id,
                username: input.username,
                status: {
                  username: {
                    // FIXME: (tessalt) merge in existing history
                    history: [
                      {
                        username: input.username,
                        createdAt: Date.now().toString(),
                      },
                    ],
                  },
                },
              },
            },
          },
        }
      );
      changeUsernameEvent.success();
      return result;
    } catch (error) {
      changeUsernameEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default UpdateUsernameMutation;
