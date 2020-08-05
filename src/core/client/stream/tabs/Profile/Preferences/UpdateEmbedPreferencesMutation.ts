import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateEmbedPreferencesEvent } from "coral-stream/events";

import { UpdateEmbedPreferencesMutation as MutationTypes } from "coral-stream/__generated__/UpdateEmbedPreferencesMutation.graphql";

let clientMutationId = 0;

const UpdateEmbedPreferencesMutation = createMutation(
  "updateEmbedPreferences",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const updateEmbedPreferences = UpdateEmbedPreferencesEvent.begin(
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
            mutation UpdateEmbedPreferencesMutation(
              $input: UpdateEmbedPreferencesInput!
            ) {
              updateEmbedPreferences(input: $input) {
                user {
                  id
                  embedPreferences {
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
      updateEmbedPreferences.success();
      return result;
    } catch (error) {
      updateEmbedPreferences.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default UpdateEmbedPreferencesMutation;
