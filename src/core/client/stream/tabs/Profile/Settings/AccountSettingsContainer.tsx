import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { AccountSettingsContainer_settings } from "coral-stream/__generated__/AccountSettingsContainer_settings.graphql";
import { AccountSettingsContainer_viewer } from "coral-stream/__generated__/AccountSettingsContainer_viewer.graphql";
import { HorizontalGutter } from "coral-ui/components";

import ChangeEmailContainer from "./ChangeEmail";
import ChangePasswordContainer from "./ChangePasswordContainer";
import ChangeUsernameContainer from "./ChangeUsername";
import DeleteAccountContainer from "./DeleteAccount/DeleteAccountContainer";
import DownloadCommentsContainer from "./DownloadCommentsContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";

import styles from "./AccountSettingsContainer.css";

interface Props {
  viewer: AccountSettingsContainer_viewer;
  settings: AccountSettingsContainer_settings;
}

const AccountSettingsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => (
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
    fragment AccountSettingsContainer_viewer on User {
      ...IgnoreUserSettingsContainer_viewer
      ...DownloadCommentsContainer_viewer
      ...DeleteAccountContainer_viewer
      ...NotificationSettingsContainer_viewer
      ...ChangeUsernameContainer_viewer
      ...ChangeEmailContainer_viewer
      ...UserBoxContainer_viewer
    }
  `,
  settings: graphql`
    fragment AccountSettingsContainer_settings on Settings {
      accountFeatures {
        downloadComments
        deleteAccount
      }
      ...ChangePasswordContainer_settings
      ...DeleteAccountContainer_settings
      ...ChangeEmailContainer_settings
      ...ChangeUsernameContainer_settings
      ...UserBoxContainer_settings
    }
  `,
})(AccountSettingsContainer);

export default enhanced;
