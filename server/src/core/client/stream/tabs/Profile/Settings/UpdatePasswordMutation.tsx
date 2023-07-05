import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { ChangePasswordEvent } from "coral-stream/events";

import { UpdatePasswordMutation as MutationTypes } from "coral-stream/__generated__/UpdatePasswordMutation.graphql";

let clientMutationId = 0;

const UpdatePasswordMutation = createMutation(
  "updatePassword",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const changePasswordEvent = ChangePasswordEvent.begin(eventEmitter);
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UpdatePasswordMutation($input: UpdatePasswordInput!) {
              updatePassword(input: $input) {
                clientMutationId
              }
            }
          `,
          variables: {
            input: {
              ...input,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
        }
      );
      changePasswordEvent.success();
      return result;
    } catch (error) {
      changePasswordEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default UpdatePasswordMutation;
