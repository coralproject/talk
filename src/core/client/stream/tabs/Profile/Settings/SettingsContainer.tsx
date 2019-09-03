import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { SettingsContainer_settings } from "coral-stream/__generated__/SettingsContainer_settings.graphql";
import { SettingsContainer_viewer } from "coral-stream/__generated__/SettingsContainer_viewer.graphql";
import { HorizontalGutter } from "coral-ui/components";

import ChangeEmailContainer from "./ChangeEmail";
import ChangePasswordContainer from "./ChangePasswordContainer";
import ChangeUsernameContainer from "./ChangeUsername";
import DeleteAccountContainer from "./DeleteAccount/DeleteAccountContainer";
import DownloadCommentsContainer from "./DownloadCommentsContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

import styles from "./SettingsContainer.css";

interface Props {
  viewer: SettingsContainer_viewer;
  settings: SettingsContainer_settings;
}

const SettingsContainer: FunctionComponent<Props> = ({ viewer, settings }) => (
  <HorizontalGutter className={styles.root}>
    <ChangeUsernameContainer settings={settings} viewer={viewer} />
    <ChangeEmailContainer settings={settings} viewer={viewer} />
    <ChangePasswordContainer settings={settings} />
    {settings.accountFeatures.downloadComments && (
      <DownloadCommentsContainer viewer={viewer} />
    )}
    {settings.accountFeatures.deleteAccount && (
      <DeleteAccountContainer viewer={viewer} settings={settings} />
    )}
    <NotificationSettingsContainer viewer={viewer} />
  </HorizontalGutter>
);

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SettingsContainer_viewer on User {
      ...IgnoreUserSettingsContainer_viewer
      ...DownloadCommentsContainer_viewer
      ...DeleteAccountContainer_viewer
      ...NotificationSettingsContainer_viewer
      ...ChangeUsernameContainer_viewer
      ...ChangeEmailContainer_viewer
    }
  `,
  settings: graphql`
    fragment SettingsContainer_settings on Settings {
      accountFeatures {
        downloadComments
        deleteAccount
      }
      ...ChangePasswordContainer_settings
      ...DeleteAccountContainer_settings
      ...ChangeEmailContainer_settings
      ...ChangeUsernameContainer_settings
    }
  `,
})(SettingsContainer);

export default enhanced;
