import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";

import { UpdateStorySettingsMutation as MutationTypes } from "coral-stream/__generated__/UpdateStorySettingsMutation.graphql";

export type UpdateStorySettingsInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation UpdateStorySettingsMutation($input: UpdateStorySettingsInput!) {
    updateStorySettings(input: $input) {
      story {
        ...ConfigureContainer_story
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: UpdateStorySettingsInput) {
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

export const withUpdateStorySettingsMutation = createMutationContainer(
  "updateStorySettings",
  commit
);

export type UpdateStorySettingsMutation = (
  input: UpdateStorySettingsInput
) => MutationResponsePromise<MutationTypes, "updateStorySettings">;
