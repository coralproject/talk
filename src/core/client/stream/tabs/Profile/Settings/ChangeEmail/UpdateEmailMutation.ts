import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { ChangeEmailEvent } from "coral-stream/events";

import { UpdateEmailMutation as MutationTypes } from "coral-stream/__generated__/UpdateEmailMutation.graphql";

let clientMutationId = 0;

const UpdateEmailMutation = createMutation(
  "updateEmail",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const viewer = getViewer(environment);
    if (!viewer) {
      return;
    }

    const changeEmailEvent = ChangeEmailEvent.begin(eventEmitter, {
      oldEmail: viewer.email || "",
      newEmail: input.email,
    });
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UpdateEmailMutation($input: UpdateEmailInput!) {
              updateEmail(input: $input) {
                clientMutationId
                user {
                  id
                  email
                  emailVerified
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
            updateEmail: {
              clientMutationId: (clientMutationId++).toString(),
              user: {
                id: viewer.id,
                email: input.email,
                emailVerified: false,
              },
            },
          },
        }
      );
      changeEmailEvent.success();
      return result;
    } catch (error) {
      changeEmailEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default UpdateEmailMutation;
