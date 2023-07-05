import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import CLASSES from "coral-stream/classes";

import { AccountSettingsContainer_settings } from "coral-stream/__generated__/AccountSettingsContainer_settings.graphql";
import { AccountSettingsContainer_viewer } from "coral-stream/__generated__/AccountSettingsContainer_viewer.graphql";

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
}) => (
  <HorizontalGutter size="oneAndAHalf" data-testid="profile-manageAccount">
    <HorizontalGutter
      className={cn(styles.root, CLASSES.accountSettings.$root)}
    >
      <ChangeUsernameContainer settings={settings} viewer={viewer} />
      <ChangeEmailContainer settings={settings} viewer={viewer} />
      <ChangePasswordContainer settings={settings} />
      {settings.accountFeatures.deleteAccount && (
        <DeleteAccountContainer viewer={viewer} settings={settings} />
      )}
    </HorizontalGutter>
  </HorizontalGutter>
);

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment AccountSettingsContainer_viewer on User {
      ...DeleteAccountContainer_viewer
      ...ChangeUsernameContainer_viewer
      ...ChangeEmailContainer_viewer
    }
  `,
  settings: graphql`
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
})(AccountSettingsContainer);

export default enhanced;
