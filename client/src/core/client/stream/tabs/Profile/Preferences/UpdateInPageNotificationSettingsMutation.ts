import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateNotificationSettingsEvent } from "coral-stream/events";

import { UpdateInPageNotificationSettingsMutation as MutationTypes } from "coral-stream/__generated__/UpdateInPageNotificationSettingsMutation.graphql";

let clientMutationId = 0;

const UpdateInPageNotificationSettingsMutation = createMutation(
  "updateInPageNotificationSettings",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const updateInPageNotificationSettings =
      // TODO: Update this event to specific in-page event
      UpdateNotificationSettingsEvent.begin(eventEmitter, {
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
            mutation UpdateInPageNotificationSettingsMutation(
              $input: UpdateInPageNotificationSettingsInput!
            ) {
              updateInPageNotificationSettings(input: $input) {
                user {
                  id
                  inPageNotifications {
                    onReply
                    onFeatured
                    onStaffReplies
                    onModeration
                    includeCountInBadge
                    bellRemainsVisible
                  }
                }
                clientMutationId
              }
            }
          `,
          variables: {
            input: {
              onReply: input.onReply,
              onFeatured: input.onFeatured,
              onStaffReplies: input.onStaffReplies,
              onModeration: input.onModeration,
              includeCountInBadge: input.includeCountInBadge,
              bellRemainsVisible: input.bellRemainsVisible,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
        }
      );
      updateInPageNotificationSettings.success();
      return result;
    } catch (error) {
      updateInPageNotificationSettings.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default UpdateInPageNotificationSettingsMutation;
