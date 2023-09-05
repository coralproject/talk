import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { UpdateStorySettingsEvent } from "coral-stream/events";

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

async function commit(
  environment: Environment,
  input: UpdateStorySettingsInput,
  { eventEmitter }: CoralContext
) {
  const updateStorySettings = UpdateStorySettingsEvent.begin(eventEmitter, {
    storyID: input.id,
    live: input.settings.live ? { enabled: input.settings.live.enabled } : null,
    messageBox: input.settings.messageBox
      ? {
          content: input.settings.messageBox.content,
          enabled: input.settings.messageBox.enabled,
          icon: input.settings.messageBox.icon,
        }
      : null,
    moderation: input.settings.moderation,
    premodLinksEnable: input.settings.premodLinksEnable,
  });
  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            id: input.id,
            settings: input.settings,
            clientMutationId: (clientMutationId++).toString(),
          },
        },
      }
    );
    updateStorySettings.success();
    return result;
  } catch (error) {
    updateStorySettings.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withUpdateStorySettingsMutation = createMutationContainer(
  "updateStorySettings",
  commit
);

export type UpdateStorySettingsMutation = (
  input: UpdateStorySettingsInput
) => MutationResponsePromise<MutationTypes, "updateStorySettings">;
