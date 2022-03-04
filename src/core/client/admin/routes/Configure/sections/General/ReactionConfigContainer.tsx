import React from "react";
import { graphql, useFragment } from "react-relay";

import { ReactionConfigContainer_settings$key as SettingsData } from "coral-admin/__generated__/ReactionConfigContainer_settings.graphql";

import ReactionConfig from "./ReactionConfig";

interface Props {
  settings: SettingsData;
  disabled: boolean;
}

const ReactionConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment ReactionConfigContainer_settings on Settings {
        reaction {
          icon
          iconActive
        }
      }
    `,
    settings
  );

  return (
    <ReactionConfig
      iconActive={settingsData.reaction.iconActive}
      icon={settingsData.reaction.icon}
      disabled={disabled}
    />
  );
};

export default ReactionConfigContainer;
