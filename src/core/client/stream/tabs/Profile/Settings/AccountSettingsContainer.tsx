import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter, Typography } from "coral-ui/components";

import { AccountSettingsContainer_organization } from "coral-stream/__generated__/AccountSettingsContainer_organization.graphql";
import { AccountSettingsContainer_site } from "coral-stream/__generated__/AccountSettingsContainer_site.graphql";
import { AccountSettingsContainer_viewer } from "coral-stream/__generated__/AccountSettingsContainer_viewer.graphql";

import ChangeEmailContainer from "./ChangeEmail";
import ChangePasswordContainer from "./ChangePasswordContainer";
import ChangeUsernameContainer from "./ChangeUsername";
import DeleteAccountContainer from "./DeleteAccount/DeleteAccountContainer";
import DownloadCommentsContainer from "./DownloadCommentsContainer";
import IgnoreUserSettingsContainer from "./IgnoreUserSettingsContainer";

import styles from "./AccountSettingsContainer.css";

interface Props {
  viewer: AccountSettingsContainer_viewer;
  organization: AccountSettingsContainer_organization;
  site: AccountSettingsContainer_site;
}

const AccountSettingsContainer: FunctionComponent<Props> = ({
  viewer,
  organization,
  site,
}) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="accountSettings-manage-account">
      <Typography variant="heading1">Manage your account</Typography>
    </Localized>
    <HorizontalGutter className={styles.root}>
      <ChangeUsernameContainer organization={organization} viewer={viewer} />
      <ChangeEmailContainer organization={organization} viewer={viewer} />
      <ChangePasswordContainer organization={organization} />
      <IgnoreUserSettingsContainer viewer={viewer} />
      {organization.settings.accountFeatures.downloadComments && (
        <DownloadCommentsContainer viewer={viewer} />
      )}
      {organization.settings.accountFeatures.deleteAccount && (
        <DeleteAccountContainer viewer={viewer} site={site} />
      )}
    </HorizontalGutter>
  </HorizontalGutter>
);

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment AccountSettingsContainer_viewer on User {
      ...IgnoreUserSettingsContainer_viewer
      ...DownloadCommentsContainer_viewer
      ...DeleteAccountContainer_viewer
      ...ChangeUsernameContainer_viewer
      ...ChangeEmailContainer_viewer
      ...UserBoxContainer_viewer
    }
  `,
  site: graphql`
    fragment AccountSettingsContainer_site on Site {
      ...DeleteAccountContainer_organization
    }
  `,
  organization: graphql`
    fragment AccountSettingsContainer_organization on Organization {
      ...ChangePasswordContainer_organization
      ...ChangeEmailContainer_organization
      ...ChangeUsernameContainer_organization
      settings {
        accountFeatures {
          downloadComments
          deleteAccount
        }
      }
    }
  `,
})(AccountSettingsContainer);

export default enhanced;
