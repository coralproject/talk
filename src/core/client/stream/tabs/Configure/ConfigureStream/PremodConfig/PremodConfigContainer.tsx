import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { PremodConfigContainer_storySettings as StorySettingsData } from "coral-stream/__generated__/PremodConfigContainer_storySettings.graphql";

import PremodConfig from "./PremodConfig";

interface Props {
  storySettings: StorySettingsData;
  onInitValues: (values: StorySettingsData) => void;
  disabled: boolean;
}

class PremodConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.storySettings);
  }

  public render() {
    const { disabled } = this.props;
    return <PremodConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  storySettings: graphql`
    fragment PremodConfigContainer_storySettings on StorySettings {
      moderation
    }
  `,
})(PremodConfigContainer);

export default enhanced;
