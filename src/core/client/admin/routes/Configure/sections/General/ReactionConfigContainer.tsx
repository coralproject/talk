import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ReactionConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ReactionConfigContainer_settings.graphql";

import ReactionConfig from "./ReactionConfig";

interface Props {
  settings: SettingsData;
  disabled: boolean;
}

const ReactionConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  return (
    <ReactionConfig
      iconActive={settings.reaction.iconActive}
      icon={settings.reaction.icon}
      disabled={disabled}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ReactionConfigContainer_settings on Settings {
      reaction {
        icon
        iconActive
      }
    }
  `,
})(ReactionConfigContainer);

export default enhanced;
