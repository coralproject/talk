import React from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { OpenOrCloseStreamContainer_story as StoryData } from "coral-stream/__generated__/OpenOrCloseStreamContainer_story.graphql";

import {
  CloseStoryMutation,
  withCloseStoryMutation,
} from "./CloseStoryMutation";
import CloseStream from "./CloseStream";
import { OpenStoryMutation, withOpenStoryMutation } from "./OpenStoryMutation";
import OpenStream from "./OpenStream";

interface Props {
  story: StoryData;
  openStory: OpenStoryMutation;
  closeStory: CloseStoryMutation;
}

interface State {
  waitingForResponse: boolean;
}

class OpenOrCloseStreamContainer extends React.Component<Props, State> {
  public state: State = {
    waitingForResponse: false,
  };

  private handleOnClick = async () => {
    if (!this.state.waitingForResponse) {
      this.setState({ waitingForResponse: true });
      if (this.props.story.isClosed) {
        await this.props.openStory({ id: this.props.story.id });
      } else {
        await this.props.closeStory({ id: this.props.story.id });
      }
      this.setState({ waitingForResponse: false });
    }
  };

  public render() {
    return this.props.story.isClosed ? (
      <OpenStream
        onClick={this.handleOnClick}
        disableButton={this.state.waitingForResponse}
      />
    ) : (
      <CloseStream
        onClick={this.handleOnClick}
        disableButton={this.state.waitingForResponse}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment OpenOrCloseStreamContainer_story on Story {
      id
      isClosed
    }
  `,
})(withOpenStoryMutation(withCloseStoryMutation(OpenOrCloseStreamContainer)));
export default enhanced;
