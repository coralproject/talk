import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { LiveUpdatesConfigContainer_storySettings } from "coral-stream/__generated__/LiveUpdatesConfigContainer_storySettings.graphql";
import { LiveUpdatesConfigContainer_storySettingsReadOnly } from "coral-stream/__generated__/LiveUpdatesConfigContainer_storySettingsReadOnly.graphql";

import LiveUpdatesConfig from "./LiveUpdatesConfig";

interface Props {
  storySettings: LiveUpdatesConfigContainer_storySettings;
  storySettingsReadOnly: LiveUpdatesConfigContainer_storySettingsReadOnly;
  onInitValues: (values: LiveUpdatesConfigContainer_storySettings) => void;
  disabled: boolean;
}

class LiveUpdatesConfigContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.storySettings);
  }

  public render() {
    const {
      disabled,
      storySettingsReadOnly: {
        live: { configurable },
      },
    } = this.props;

    if (!configurable) {
      return null;
    }

    return <LiveUpdatesConfig disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  storySettings: graphql`
    fragment LiveUpdatesConfigContainer_storySettings on StorySettings {
      live {
        enabled
      }
    }
  `,
  storySettingsReadOnly: graphql`
    fragment LiveUpdatesConfigContainer_storySettingsReadOnly on StorySettings {
      live {
        configurable
      }
    }
  `,
})(LiveUpdatesConfigContainer);

export default enhanced;
