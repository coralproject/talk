import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { UserRowContainer_settings as SettingsData } from "coral-admin/__generated__/UserRowContainer_settings.graphql";
import { UserRowContainer_user as UserData } from "coral-admin/__generated__/UserRowContainer_user.graphql";
import { UserRowContainer_viewer as ViewerData } from "coral-admin/__generated__/UserRowContainer_viewer.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import UserRow from "./UserRow";

interface Props {
  user: UserData;
  viewer: ViewerData;
  settings: SettingsData;
  onUsernameClicked?: (userID: string) => void;
}

const UserRowContainer: FunctionComponent<Props> = props => {
  const { locales } = useCoralContext();
  return (
    <UserRow
      user={props.user}
      settings={props.settings}
      viewer={props.viewer}
      userID={props.user.id}
      username={props.user.username!}
      email={props.user.email}
      memberSince={new Intl.DateTimeFormat(locales, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(props.user.createdAt))}
      onUsernameClicked={props.onUsernameClicked}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRowContainer_viewer on User {
      ...UserRoleChangeContainer_viewer
    }
  `,
  settings: graphql`
    fragment UserRowContainer_settings on Settings {
      ...UserStatusChangeContainer_settings
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
    }
  `,
})(UserRowContainer);

export default enhanced;
