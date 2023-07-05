import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateNotificationSettingsEvent } from "coral-stream/events";

import { UpdateNotificationSettingsMutation as MutationTypes } from "coral-stream/__generated__/UpdateNotificationSettingsMutation.graphql";

let clientMutationId = 0;

const UpdateNotificationSettingsMutation = createMutation(
  "updateNotificationSettings",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const updateNofitificationSettings = UpdateNotificationSettingsEvent.begin(
      eventEmitter,
      {
        digestFrequency: input.digestFrequency,
        onFeatured: input.onFeatured,
        onModeration: input.onModeration,
        onStaffReplies: input.onStaffReplies,
        onReply: input.onReply,
      }
    );
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UpdateNotificationSettingsMutation(
              $input: UpdateNotificationSettingsInput!
            ) {
              updateNotificationSettings(input: $input) {
                user {
                  id
                  notifications {
                    onReply
                    onFeatured
                    onStaffReplies
                    onModeration
                    digestFrequency
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
      updateNofitificationSettings.success();
      return result;
    } catch (error) {
      updateNofitificationSettings.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default UpdateNotificationSettingsMutation;
