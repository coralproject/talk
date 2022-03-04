import React from "react";
import { graphql, useFragment } from "react-relay";

import { CommentStreamLiveUpdatesContainer_settings$key as CommentStreamLiveUpdatesContainer_settings } from "coral-admin/__generated__/CommentStreamLiveUpdatesContainer_settings.graphql";

import CommentStreamLiveUpdates from "./CommentStreamLiveUpdates";

interface Props {
  settings: CommentStreamLiveUpdatesContainer_settings;
  disabled: boolean;
}

const CommentStreamLiveUpdatesContainer: React.FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment CommentStreamLiveUpdatesContainer_settings on Settings {
        live {
          configurable
        }
      }
    `,
    settings
  );

  const {
    live: { configurable },
  } = settingsData;

  if (!configurable) {
    return null;
  }

  return <CommentStreamLiveUpdates disabled={disabled} />;
};

export default CommentStreamLiveUpdatesContainer;
