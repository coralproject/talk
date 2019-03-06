import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PremodConfigContainer_story as StoryData } from "talk-stream/__generated__/PremodConfigContainer_story.graphql";

import PremodConfig from "../components/PremodConfig";

interface Props {
  story: StoryData;
  onInitValues: (values: StoryData) => void;
  disabled: boolean;
}

class PremodConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.story);
  }

  public render() {
    const { disabled } = this.props;
    return <PremodConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment PremodConfigContainer_story on Story {
      moderation
    }
  `,
})(PremodConfigContainer);

export default enhanced;
