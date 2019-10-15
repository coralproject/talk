import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { CommentStreamLiveUpdatesContainer_settings } from "coral-admin/__generated__/CommentStreamLiveUpdatesContainer_settings.graphql";
import { CommentStreamLiveUpdatesContainer_settingsReadOnly } from "coral-admin/__generated__/CommentStreamLiveUpdatesContainer_settingsReadOnly.graphql";

import CommentStreamLiveUpdates from "./CommentStreamLiveUpdates";

interface Props {
  settingsReadOnly: CommentStreamLiveUpdatesContainer_settingsReadOnly;
  settings: CommentStreamLiveUpdatesContainer_settings;
  onInitValues: (values: CommentStreamLiveUpdatesContainer_settings) => void;
  disabled: boolean;
}

class CommentStreamLiveUpdatesContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.onInitValues(props.settings);
  }

  public render() {
    const {
      disabled,
      settingsReadOnly: {
        live: { configurable },
      },
    } = this.props;

    if (!configurable) {
      return null;
    }

    return <CommentStreamLiveUpdates disabled={disabled} />;
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CommentStreamLiveUpdatesContainer_settings on Settings {
      live {
        enabled
      }
    }
  `,
  settingsReadOnly: graphql`
    fragment CommentStreamLiveUpdatesContainer_settingsReadOnly on Settings {
      live {
        configurable
      }
    }
  `,
})(CommentStreamLiveUpdatesContainer);

export default enhanced;
