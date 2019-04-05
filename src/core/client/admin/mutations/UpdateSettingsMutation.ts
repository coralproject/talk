import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { UpdateSettingsMutation as MutationTypes } from "talk-admin/__generated__/UpdateSettingsMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

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
              ...ModerationConfigContainer_settings
              ...GeneralConfigContainer_settings
              ...OrganizationConfigContainer_settings
              ...WordListConfigContainer_settings
              ...AdvancedConfigContainer_settings
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
