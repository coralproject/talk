import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { SubmitHookHandler } from "coral-framework/lib/form";

import { ConfigureStreamContainer_story$key as StoryData } from "coral-stream/__generated__/ConfigureStreamContainer_story.graphql";

import ConfigureStream from "./ConfigureStream";
import {
  UpdateStorySettingsInput,
  UpdateStorySettingsMutation,
  withUpdateStorySettingsMutation,
} from "./UpdateStorySettingsMutation";

interface Props {
  story: StoryData;
  updateStorySettings: UpdateStorySettingsMutation;
}

const ConfigureStreamContainer: FunctionComponent<Props> = ({
  story,
  updateStorySettings,
}) => {
  const storyData = useFragment(
    graphql`
      fragment ConfigureStreamContainer_story on Story {
        id
        settings {
          ...PremodConfig_formValues @relay(mask: false)
          ...PremodLinksConfig_formValues @relay(mask: false)
        }
      }
    `,
    story
  );

  const handleExecute = useCallback(
    async (data: UpdateStorySettingsInput["settings"], form: FormApi) => {
      await updateStorySettings({
        id: storyData.id,
        settings: data,
      });
      form.initialize(data);
    },
    [storyData.id, updateStorySettings]
  );

  return (
    <SubmitHookHandler onExecute={handleExecute}>
      {({ onSubmit }) => (
        <ConfigureStream
          onSubmit={onSubmit}
          storyID={storyData.id}
          storySettings={storyData.settings}
        />
      )}
    </SubmitHookHandler>
  );
};

const enhanced = withUpdateStorySettingsMutation(ConfigureStreamContainer);

export default enhanced;
