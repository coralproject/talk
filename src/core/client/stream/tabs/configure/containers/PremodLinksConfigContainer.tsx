import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { PremodLinksConfigContainer_storySettings as StorySettingsData } from "coral-stream/__generated__/PremodLinksConfigContainer_storySettings.graphql";

import PremodLinksConfig from "../components/PremodLinksConfig";

interface Props {
  storySettings: StorySettingsData;
  onInitValues: (values: StorySettingsData) => void;
  disabled: boolean;
}

class PremodLinksConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.storySettings);
  }

  public render() {
    const { disabled } = this.props;
    return <PremodLinksConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  storySettings: graphql`
    fragment PremodLinksConfigContainer_storySettings on StorySettings {
      premodLinksEnable
    }
  `,
})(PremodLinksConfigContainer);

export default enhanced;
