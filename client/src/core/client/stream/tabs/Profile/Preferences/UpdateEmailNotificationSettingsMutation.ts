import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateNotificationSettingsEvent } from "coral-stream/events";

import { UpdateEmailNotificationSettingsMutation as MutationTypes } from "coral-stream/__generated__/UpdateEmailNotificationSettingsMutation.graphql";

let clientMutationId = 0;

const UpdateEmailNotificationSettingsMutation = createMutation(
  "updateEmailNotificationSettings",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const updateEmailNotificationSettings =
      UpdateNotificationSettingsEvent.begin(eventEmitter, {
        digestFrequency: input.digestFrequency,
        onFeatured: input.onFeatured,
        onModeration: input.onModeration,
        onStaffReplies: input.onStaffReplies,
        onReply: input.onReply,
      });
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UpdateEmailNotificationSettingsMutation(
              $input: UpdateEmailNotificationSettingsInput!
            ) {
              updateEmailNotificationSettings(input: $input) {
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
      updateEmailNotificationSettings.success();
      return result;
    } catch (error) {
      updateEmailNotificationSettings.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default UpdateEmailNotificationSettingsMutation;
