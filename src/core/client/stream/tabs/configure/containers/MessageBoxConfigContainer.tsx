import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { MessageBoxConfigContainer_storySettings as StorySettingsData } from "talk-stream/__generated__/MessageBoxConfigContainer_storySettings.graphql";

import MessageBoxConfig from "../components/MessageBoxConfig";

interface Props {
  storySettings: StorySettingsData;
  onInitValues: (values: StorySettingsData) => void;
  disabled: boolean;
}

class MessageBoxConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.storySettings);
  }

  public render() {
    const { disabled } = this.props;
    return <MessageBoxConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  storySettings: graphql`
    fragment MessageBoxConfigContainer_storySettings on StorySettings {
      messageBox {
        enabled
        content
        icon
      }
    }
  `,
})(MessageBoxConfigContainer);

export default enhanced;
