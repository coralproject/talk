import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateUserMediaSettingsEvent } from "coral-stream/events";

import { UpdateUserMediaSettingsMutation as MutationTypes } from "coral-stream/__generated__/UpdateUserMediaSettingsMutation.graphql";

let clientMutationId = 0;

const UpdateUserMediaSettingsMutation = createMutation(
  "updateUserMediaSettings",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const updateMediaSettings = UpdateUserMediaSettingsEvent.begin(
      eventEmitter,
      {
        unfurlEmbeds: input.unfurlEmbeds,
      }
    );
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UpdateUserMediaSettingsMutation(
              $input: UpdateUserMediaSettingsInput!
            ) {
              updateUserMediaSettings(input: $input) {
                user {
                  id
                  mediaSettings {
                    unfurlEmbeds
                  }
                }
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
      updateMediaSettings.success();
      return result;
    } catch (error) {
      updateMediaSettings.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default UpdateUserMediaSettingsMutation;
