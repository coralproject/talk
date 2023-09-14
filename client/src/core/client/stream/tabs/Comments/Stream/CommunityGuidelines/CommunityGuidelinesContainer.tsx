import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { CommunityGuidelinesContainer_settings as SettingsData } from "coral-stream/__generated__/CommunityGuidelinesContainer_settings.graphql";

import CommunityGuidelines from "./CommunityGuidelines";

interface Props {
  settings: SettingsData;
}

export const CommunityGuidelinesContainerProps: FunctionComponent<Props> = ({
  settings,
}) => {
  if (
    !settings.communityGuidelines.enabled ||
    !settings.communityGuidelines.content
  ) {
    return null;
  }
  return (
    <CommunityGuidelines>
      {settings.communityGuidelines.content}
    </CommunityGuidelines>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CommunityGuidelinesContainer_settings on Settings {
      communityGuidelines {
        enabled
        content
      }
    }
  `,
})(CommunityGuidelinesContainerProps);

export default enhanced;
