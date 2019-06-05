import React from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { StoryClosedTimeoutContainer_story as StoryData } from "coral-stream/__generated__/StoryClosedTimeoutContainer_story.graphql";
import {
  SetStoryClosedMutation,
  withSetStoryClosedMutation,
} from "./SetStoryClosedMutation";

interface Props {
  story: StoryData;
  setStoryClosed: SetStoryClosedMutation;
}

function createTimeout(callback: () => void, closedAt: string) {
  const diff = new Date(closedAt).valueOf() - Date.now();
  if (diff > 0) {
    return setTimeout(callback, diff);
  }
  return null;
}

class StoryClosedTimeoutContainer extends React.Component<Props> {
  private timer: any = null;

  constructor(props: Props) {
    super(props);
    if (props.story.closedAt) {
      this.timer = createTimeout(this.handleClose, this.props.story.closedAt);
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.story.closedAt !== this.props.story.closedAt) {
      clearTimeout(this.timer);
      this.timer = createTimeout(this.handleClose, nextProps.story.closedAt);
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  private handleClose = () => {
    this.timer = null;
    this.props.setStoryClosed({ storyID: this.props.story.id, isClosed: true });
  };

  public render() {
    return null;
  }
}

const enhanced = withSetStoryClosedMutation(
  withFragmentContainer<Props>({
    story: graphql`
      fragment StoryClosedTimeoutContainer_story on Story {
        id
        closedAt
      }
    `,
  })(StoryClosedTimeoutContainer)
);

export default enhanced;
