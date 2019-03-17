import { FormApi } from "final-form";
import React from "react";

import { SubmitHookHandler } from "talk-framework/lib/form";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { ConfigureCommentStreamContainer_story as StoryData } from "talk-stream/__generated__/ConfigureCommentStreamContainer_story.graphql";
import {
  UpdateStorySettingsInput,
  UpdateStorySettingsMutation,
  withUpdateStorySettingsMutation,
} from "talk-stream/mutations";

import ConfigureCommentStream from "../components/ConfigureCommentStream";

interface Props {
  story: StoryData;
  updateStorySettings: UpdateStorySettingsMutation;
}

class ConfigureCommentStreamContainer extends React.Component<Props> {
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
          <ConfigureCommentStream
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
    fragment ConfigureCommentStreamContainer_story on Story {
      id
      settings {
        ...PremodConfigContainer_storySettings
        ...PremodLinksConfigContainer_storySettings
      }
    }
  `,
})(withUpdateStorySettingsMutation(ConfigureCommentStreamContainer));
export default enhanced;
