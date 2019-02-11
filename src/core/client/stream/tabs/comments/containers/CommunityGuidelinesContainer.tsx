import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { CommunityGuidelinesContainer_settings as SettingsData } from "talk-stream/__generated__/CommunityGuidelinesContainer_settings.graphql";

import CommunityGuidelines from "../components/CommunityGuidelines";

interface Props {
  settings: SettingsData;
}

export const CommunityGuidelinesContainerProps: StatelessComponent<Props> = ({
  settings,
}) => {
  if (!settings.communityGuidelinesEnable || !settings.communityGuidelines) {
    return null;
  }
  return (
    <CommunityGuidelines>{settings.communityGuidelines}</CommunityGuidelines>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment CommunityGuidelinesContainer_settings on Settings {
      communityGuidelinesEnable
      communityGuidelines
    }
  `,
})(CommunityGuidelinesContainerProps);

export default enhanced;
