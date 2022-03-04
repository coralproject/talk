import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";

import { UserRowContainer_settings$key as SettingsData } from "coral-admin/__generated__/UserRowContainer_settings.graphql";
import { UserRowContainer_user$key as UserData } from "coral-admin/__generated__/UserRowContainer_user.graphql";
import { UserRowContainer_viewer$key as ViewerData } from "coral-admin/__generated__/UserRowContainer_viewer.graphql";

import UserRow from "./UserRow";

interface Props {
  user: UserData;
  viewer: ViewerData;
  settings: SettingsData;
  onUsernameClicked?: (userID: string) => void;
}

const UserRowContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  settings,
  onUsernameClicked,
}) => {
  const userData = useFragment(
    graphql`
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
    user
  );
  const viewerData = useFragment(
    graphql`
      fragment UserRowContainer_viewer on User {
        ...UserStatusChangeContainer_viewer
        ...UserRoleChangeContainer_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment UserRowContainer_settings on Settings {
        ...UserStatusChangeContainer_settings
        ...UserRoleChangeContainer_settings
      }
    `,
    settings
  );

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <UserRow
      user={userData}
      settings={settingsData}
      viewer={viewerData}
      userID={userData.id}
      username={userData.username}
      email={userData.email}
      memberSince={formatter(userData.createdAt)}
      onUsernameClicked={onUsernameClicked}
      deletedAt={userData.deletedAt}
    />
  );
};

export default UserRowContainer;
