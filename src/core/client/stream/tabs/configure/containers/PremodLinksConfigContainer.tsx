import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PremodLinksConfigContainer_story as StoryData } from "talk-stream/__generated__/PremodLinksConfigContainer_story.graphql";

import PremodLinksConfig from "../components/PremodLinksConfig";

interface Props {
  story: StoryData;
  onInitValues: (values: StoryData) => void;
  disabled: boolean;
}

class PremodLinksConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.story);
  }

  public render() {
    const { disabled } = this.props;
    return <PremodLinksConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment PremodLinksConfigContainer_story on Story {
      settings {
        premodLinksEnable
      }
    }
  `,
})(PremodLinksConfigContainer);

export default enhanced;
