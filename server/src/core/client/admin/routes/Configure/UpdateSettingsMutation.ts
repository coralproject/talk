import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateSettingsMutation as MutationTypes } from "coral-admin/__generated__/UpdateSettingsMutation.graphql";

let clientMutationId = 0;

const UpdateSettingsMutation = createMutation(
  "updateSettings",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateSettingsMutation($input: UpdateSettingsInput!) {
          updateSettings(input: $input) {
            settings {
              auth {
                ...AuthConfigContainer_auth
              }
              email {
                ...EmailConfigContainer_email
              }
              ...ModerationConfigContainer_settings
              ...GeneralConfigContainer_settings
              ...OrganizationConfigContainer_settings
              ...WordListConfigContainer_settings
              ...AdvancedConfigContainer_settings
              ...SlackConfigContainer_settings
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

export default UpdateSettingsMutation;
