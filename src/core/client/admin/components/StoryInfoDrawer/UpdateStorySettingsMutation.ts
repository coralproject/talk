import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { graphql } from "relay-runtime";
import { Environment } from "relay-runtime";

import { UpdateStorySettingsMutation as MutationTypes } from "coral-admin/__generated__/UpdateStorySettingsMutation.graphql";

let clientMutationId = 0;

const UpdateStorySettingsMutation = createMutation(
  "updateStorySettings",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<any>(environment, {
      mutation: graphql`
        mutation UpdateStorySettingsMutation(
          $input: UpdateStorySettingsInput!
        ) {
          updateStorySettings(input: $input) {
            story {
              settings {
                mode
                moderation
                live {
                  configurable
                  enabled
                }
                premodLinksEnable
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
    })
);

export default UpdateStorySettingsMutation;
