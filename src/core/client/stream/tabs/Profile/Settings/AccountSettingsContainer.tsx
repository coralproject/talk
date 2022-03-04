import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { HorizontalGutter } from "coral-ui/components/v2";

import { AccountSettingsContainer_settings$key as AccountSettingsContainer_settings } from "coral-stream/__generated__/AccountSettingsContainer_settings.graphql";
import { AccountSettingsContainer_viewer$key as AccountSettingsContainer_viewer } from "coral-stream/__generated__/AccountSettingsContainer_viewer.graphql";

import ChangeEmailContainer from "./ChangeEmail";
import ChangePasswordContainer from "./ChangePasswordContainer";
import ChangeUsernameContainer from "./ChangeUsername";
import DeleteAccountContainer from "./DeleteAccount/DeleteAccountContainer";

// import DownloadCommentsContainer from "../CommentHistory/DownloadCommentsContainer";
import styles from "./AccountSettingsContainer.css";

interface Props {
  viewer: AccountSettingsContainer_viewer;
  settings: AccountSettingsContainer_settings;
}

const AccountSettingsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment AccountSettingsContainer_viewer on User {
        ...DeleteAccountContainer_viewer
        ...ChangeUsernameContainer_viewer
        ...ChangeEmailContainer_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment AccountSettingsContainer_settings on Settings {
        accountFeatures {
          deleteAccount
        }
        ...ChangePasswordContainer_settings
        ...DeleteAccountContainer_settings
        ...ChangeEmailContainer_settings
        ...ChangeUsernameContainer_settings
      }
    `,
    settings
  );

  return (
    <HorizontalGutter size="oneAndAHalf" data-testid="profile-manageAccount">
      <HorizontalGutter className={styles.root}>
        <ChangeUsernameContainer settings={settingsData} viewer={viewerData} />
        <ChangeEmailContainer settings={settingsData} viewer={viewerData} />
        <ChangePasswordContainer settings={settingsData} />
        {settingsData.accountFeatures.deleteAccount && (
          <DeleteAccountContainer viewer={viewerData} settings={settingsData} />
        )}
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default AccountSettingsContainer;
