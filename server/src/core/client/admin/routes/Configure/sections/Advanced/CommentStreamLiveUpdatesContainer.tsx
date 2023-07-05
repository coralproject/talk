import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { CommentStreamLiveUpdatesContainer_settings } from "coral-admin/__generated__/CommentStreamLiveUpdatesContainer_settings.graphql";

import CommentStreamLiveUpdates from "./CommentStreamLiveUpdates";

interface Props {
  settings: CommentStreamLiveUpdatesContainer_settings;
  disabled: boolean;
}

const CommentStreamLiveUpdatesContainer: React.FunctionComponent<Props> = ({
  disabled,
  settings: {
    live: { configurable },
  },
}) => {
  if (!configurable) {
    return null;
  }

  return <CommentStreamLiveUpdates disabled={disabled} />;
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CommentStreamLiveUpdatesContainer_settings on Settings {
      live {
        configurable
      }
    }
  `,
})(CommentStreamLiveUpdatesContainer);

export default enhanced;
