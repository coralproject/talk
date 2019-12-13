import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { LiveUpdatesConfigContainer_storySettings } from "coral-stream/__generated__/LiveUpdatesConfigContainer_storySettings.graphql";

import LiveUpdatesConfig from "./LiveUpdatesConfig";

interface Props {
  storySettings: LiveUpdatesConfigContainer_storySettings;
  disabled: boolean;
}

class LiveUpdatesConfigContainer extends React.Component<Props> {
  public render() {
    const {
      disabled,
      storySettings: {
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
        configurable
      }
    }
  `,
})(LiveUpdatesConfigContainer);

export default enhanced;
