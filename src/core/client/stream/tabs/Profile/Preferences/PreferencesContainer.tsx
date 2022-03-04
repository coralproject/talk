import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { HorizontalGutter } from "coral-ui/components/v2";

import { PreferencesContainer_settings$key as PreferencesContainer_settings } from "coral-stream/__generated__/PreferencesContainer_settings.graphql";
import { PreferencesContainer_viewer$key as PreferencesContainer_viewer } from "coral-stream/__generated__/PreferencesContainer_viewer.graphql";

import BioContainer from "./BioContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import MediaSettingsContainer from "./MediaSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

interface Props {
  viewer: PreferencesContainer_viewer;
  settings: PreferencesContainer_settings;
}

const PreferencesContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment PreferencesContainer_settings on Settings {
        ...MediaSettingsContainer_settings
        ...BioContainer_settings
      }
    `,
    settings
  );
  const viewerData = useFragment(
    graphql`
      fragment PreferencesContainer_viewer on User {
        ...NotificationSettingsContainer_viewer
        ...IgnoreUserSettingsContainer_viewer
        ...MediaSettingsContainer_viewer
        ...BioContainer_viewer
      }
    `,
    viewer
  );

  return (
    <HorizontalGutter spacing={4}>
      <BioContainer viewer={viewerData} settings={settingsData} />
      <NotificationSettingsContainer viewer={viewerData} />
      <MediaSettingsContainer viewer={viewerData} settings={settingsData} />
      <IgnoreUserSettingsContainer viewer={viewerData} />
    </HorizontalGutter>
  );
};

export default PreferencesContainer;
