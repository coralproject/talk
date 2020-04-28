import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { SubmitHookHandler } from "coral-framework/lib/form";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { ConfigureStreamContainer_story as StoryData } from "coral-stream/__generated__/ConfigureStreamContainer_story.graphql";

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
            storyID={this.props.story.id}
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
        ...PremodConfig_formValues @relay(mask: false)
        ...PremodLinksConfig_formValues @relay(mask: false)
      }
    }
  `,
})(withUpdateStorySettingsMutation(ConfigureStreamContainer));

export default enhanced;
