import { FormApi } from "final-form";
import React from "react";

import { SubmitHookHandler } from "talk-framework/lib/form";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { ConfigureCommentStreamContainer_story as StoryData } from "talk-stream/__generated__/ConfigureCommentStreamContainer_story.graphql";
import {
  UpdateStoryInput,
  UpdateStoryMutation,
  withUpdateStoryMutation,
} from "talk-stream/mutations";

import ConfigureCommentStream from "../components/ConfigureCommentStream";

interface Props {
  story: StoryData;
  updateStory: UpdateStoryMutation;
}

class ConfigureCommentStreamContainer extends React.Component<Props> {
  private handleExecute = async (
    data: UpdateStoryInput["story"],
    form: FormApi
  ) => {
    await this.props.updateStory({ id: this.props.story.id, story: data });
    form.initialize(data);
  };

  public render() {
    return (
      <SubmitHookHandler onExecute={this.handleExecute}>
        {({ onSubmit }) => (
          <ConfigureCommentStream
            onSubmit={onSubmit}
            story={this.props.story}
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
      ...PremodConfigContainer_story
      ...PremodLinksConfigContainer_story
    }
  `,
})(withUpdateStoryMutation(ConfigureCommentStreamContainer));
export default enhanced;
