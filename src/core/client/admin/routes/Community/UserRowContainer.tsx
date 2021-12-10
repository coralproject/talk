import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { UserRowContainer_settings as SettingsData } from "coral-admin/__generated__/UserRowContainer_settings.graphql";
import { UserRowContainer_user as UserData } from "coral-admin/__generated__/UserRowContainer_user.graphql";
import { UserRowContainer_viewer as ViewerData } from "coral-admin/__generated__/UserRowContainer_viewer.graphql";

import UserRow from "./UserRow";

interface Props {
  user: UserData;
  viewer: ViewerData;
  settings: SettingsData;
  onUsernameClicked?: (userID: string) => void;
}

const UserRowContainer: FunctionComponent<Props> = (props) => {
  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <UserRow
      user={props.user}
      settings={props.settings}
      viewer={props.viewer}
      userID={props.user.id}
      username={props.user.username}
      email={props.user.email}
      memberSince={formatter(props.user.createdAt)}
      onUsernameClicked={props.onUsernameClicked}
      deletedAt={props.user.deletedAt}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRowContainer_viewer on User {
      ...UserStatusChangeContainer_viewer
      ...UserRoleChangeContainer_viewer
    }
  `,
  settings: graphql`
    fragment UserRowContainer_settings on Settings {
      ...UserStatusChangeContainer_settings
      ...UserRoleChangeContainer_settings
    }
  `,
  user: graphql`
    fragment UserRowContainer_user on User {
      ...UserStatusChangeContainer_user
      ...UserRoleChangeContainer_user
      id
      username
      email
      createdAt
      deletedAt
    }
  `,
})(UserRowContainer);

export default enhanced;
