import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";
import { HorizontalGutter } from "coral-ui/components/v2";

import { PreferencesContainer_settings } from "coral-stream/__generated__/PreferencesContainer_settings.graphql";
import { PreferencesContainer_viewer } from "coral-stream/__generated__/PreferencesContainer_viewer.graphql";
import { PreferencesContainerLocal } from "coral-stream/__generated__/PreferencesContainerLocal.graphql";

import BioContainer from "./BioContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import MediaSettingsContainer from "./MediaSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

interface Props {
  viewer: PreferencesContainer_viewer;
  settings: PreferencesContainer_settings;
}

const PreferencesContainer: FunctionComponent<Props> = (props) => {
  const [{ storyMode }] = useLocal<PreferencesContainerLocal>(graphql`
    fragment PreferencesContainerLocal on Local {
      storyMode
    }
  `);

  return (
    <HorizontalGutter spacing={4}>
      <BioContainer viewer={props.viewer} settings={props.settings} />
      {storyMode !== GQLSTORY_MODE.CHAT && (
        <NotificationSettingsContainer viewer={props.viewer} />
      )}
      <MediaSettingsContainer viewer={props.viewer} settings={props.settings} />
      <IgnoreUserSettingsContainer viewer={props.viewer} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PreferencesContainer_settings on Settings {
      ...MediaSettingsContainer_settings
      ...BioContainer_settings
    }
  `,
  viewer: graphql`
    fragment PreferencesContainer_viewer on User {
      ...NotificationSettingsContainer_viewer
      ...IgnoreUserSettingsContainer_viewer
      ...MediaSettingsContainer_viewer
      ...BioContainer_viewer
    }
  `,
})(PreferencesContainer);

export default enhanced;
