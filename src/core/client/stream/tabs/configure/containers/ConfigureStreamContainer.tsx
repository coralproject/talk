import { FormApi } from "final-form";
import React from "react";

import { SubmitHookHandler } from "talk-framework/lib/form";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { ConfigureStreamContainer_story as StoryData } from "talk-stream/__generated__/ConfigureStreamContainer_story.graphql";
import {
  UpdateStorySettingsInput,
  UpdateStorySettingsMutation,
  withUpdateStorySettingsMutation,
} from "talk-stream/mutations";

import ConfigureStream from "../components/ConfigureStream";

interface Props {
  story: StoryData;
  updateStorySettings: UpdateStorySettingsMutation;
}

class ConfigureStreamContainer extends React.Component<Props> {
  private handleExecute = async (
    data: UpdateStorySettingsInput["settings"],
    form: FormApi
  ) => {
    await this.props.updateStorySettings({
      id: this.props.story.id,
      settings: data,
    });
    form.initialize(data);
  };

  public render() {
    return (
      <SubmitHookHandler onExecute={this.handleExecute}>
        {({ onSubmit }) => (
          <ConfigureStream
            onSubmit={onSubmit}
            storySettings={this.props.story.settings}
          />
        )}
      </SubmitHookHandler>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ConfigureStreamContainer_story on Story {
      id
      settings {
        ...PremodConfigContainer_storySettings
        ...PremodLinksConfigContainer_storySettings
        ...MessageBoxConfigContainer_storySettings
      }
    }
  `,
})(withUpdateStorySettingsMutation(ConfigureStreamContainer));
export default enhanced;
