import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { UpdateSettingsMutation as MutationTypes } from "talk-admin/__generated__/UpdateSettingsMutation.graphql";

export type UpdateSettingsInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation UpdateSettingsMutation($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      settings {
        auth {
          ...FacebookConfigContainer_auth
          ...FacebookConfigContainer_authReadOnly
          ...GoogleConfigContainer_auth
          ...GoogleConfigContainer_authReadOnly
          ...SSOConfigContainer_auth
          ...SSOConfigContainer_authReadOnly
          ...OIDCConfigListContainer_auth
          ...OIDCConfigListContainer_authReadOnly
          ...DisplayNamesConfigContainer_auth
        }
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
) => Promise<MutationTypes["response"]["updateSettings"]>;
