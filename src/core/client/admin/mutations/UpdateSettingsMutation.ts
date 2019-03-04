import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { UpdateSettingsMutation as MutationTypes } from "talk-admin/__generated__/UpdateSettingsMutation.graphql";

export type UpdateSettingsInput = MutationInput<MutationTypes>;

const mutation = graphql`
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
`;

let clientMutationId = 0;

function commit(environment: Environment, input: UpdateSettingsInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

export const withUpdateSettingsMutation = createMutationContainer(
  "updateSettings",
  commit
);

export type UpdateSettingsMutation = (
  input: UpdateSettingsInput
) => MutationResponsePromise<MutationTypes, "updateSettings">;
