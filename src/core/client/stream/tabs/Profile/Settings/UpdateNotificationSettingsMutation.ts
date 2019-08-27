import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UpdateNotificationSettingsMutation as MutationTypes } from "coral-stream/__generated__/UpdateNotificationSettingsMutation.graphql";

let clientMutationId = 0;

const UpdateNotificationSettingsMutation = createMutation(
  "updateNotificationSettings",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
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
    })
);

export default UpdateNotificationSettingsMutation;
