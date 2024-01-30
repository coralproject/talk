import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { PreferencesContainer_settings } from "coral-stream/__generated__/PreferencesContainer_settings.graphql";
import { PreferencesContainer_viewer } from "coral-stream/__generated__/PreferencesContainer_viewer.graphql";

import BioContainer from "./BioContainer";
import EmailNotificationSettingsContainer from "./EmailNotificationSettingsContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import InPageNotificationSettingsContainer from "./InPageNotificationSettingsContainer";
import MediaSettingsContainer from "./MediaSettingsContainer";

interface Props {
  viewer: PreferencesContainer_viewer;
  settings: PreferencesContainer_settings;
}

const PreferencesContainer: FunctionComponent<Props> = (props) => {
  const showInPageNotificationSettings =
    !!props.settings.inPageNotifications.enabled;
  return (
    <HorizontalGutter spacing={4}>
      <BioContainer viewer={props.viewer} settings={props.settings} />
      {showInPageNotificationSettings && (
        <InPageNotificationSettingsContainer viewer={props.viewer} />
      )}
      <EmailNotificationSettingsContainer viewer={props.viewer} />
      <MediaSettingsContainer viewer={props.viewer} settings={props.settings} />
      <IgnoreUserSettingsContainer viewer={props.viewer} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PreferencesContainer_settings on Settings {
      inPageNotifications {
        enabled
      }
      ...MediaSettingsContainer_settings
      ...BioContainer_settings
    }
  `,
  viewer: graphql`
    fragment PreferencesContainer_viewer on User {
      ...EmailNotificationSettingsContainer_viewer
      ...InPageNotificationSettingsContainer_viewer
      ...IgnoreUserSettingsContainer_viewer
      ...MediaSettingsContainer_viewer
      ...BioContainer_viewer
    }
  `,
})(PreferencesContainer);

export default enhanced;
