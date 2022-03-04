import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { CommunityGuidelinesContainer_settings$key as SettingsData } from "coral-stream/__generated__/CommunityGuidelinesContainer_settings.graphql";

import CommunityGuidelines from "./CommunityGuidelines";

interface Props {
  settings: SettingsData;
}

export const CommunityGuidelinesContainerProps: FunctionComponent<Props> = ({
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment CommunityGuidelinesContainer_settings on Settings {
        communityGuidelines {
          enabled
          content
        }
      }
    `,
    settings
  );

  if (
    !settingsData.communityGuidelines.enabled ||
    !settingsData.communityGuidelines.content
  ) {
    return null;
  }
  return (
    <CommunityGuidelines>
      {settingsData.communityGuidelines.content}
    </CommunityGuidelines>
  );
};

export default CommunityGuidelinesContainerProps;
