import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { SettingsContainer_viewer as ViewerData } from "coral-stream/__generated__/SettingsContainer_viewer.graphql";

import DownloadCommentsContainer from "./DownloadCommentsContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";

interface Props {
  viewer: ViewerData;
}

const SettingsContainer: FunctionComponent<Props> = ({ viewer }) => {
  return (
    <>
      <IgnoreUserSettingsContainer viewer={viewer} />
      <DownloadCommentsContainer viewer={viewer} />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SettingsContainer_viewer on User {
      ...IgnoreUserSettingsContainer_viewer
      ...DownloadCommentsContainer_viewer
    }
  `,
})(SettingsContainer);

export default enhanced;
