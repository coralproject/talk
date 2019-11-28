import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { UserRowContainer_organization as OrgData } from "coral-admin/__generated__/UserRowContainer_organization.graphql";
import { UserRowContainer_user as UserData } from "coral-admin/__generated__/UserRowContainer_user.graphql";
import { UserRowContainer_viewer as ViewerData } from "coral-admin/__generated__/UserRowContainer_viewer.graphql";

import UserRow from "./UserRow";

interface Props {
  user: UserData;
  viewer: ViewerData;
  organization: OrgData;
  onUsernameClicked?: (userID: string) => void;
}

const UserRowContainer: FunctionComponent<Props> = props => {
  const { locales } = useCoralContext();
  return (
    <UserRow
      user={props.user}
      organization={props.organization}
      viewer={props.viewer}
      userID={props.user.id}
      username={props.user.username}
      email={props.user.email}
      memberSince={new Intl.DateTimeFormat(locales, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(props.user.createdAt))}
      onUsernameClicked={props.onUsernameClicked}
      deletedAt={props.user.deletedAt}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRowContainer_viewer on User {
      ...UserRoleChangeContainer_viewer
    }
  `,
  organization: graphql`
    fragment UserRowContainer_organization on Organization {
      ...UserStatusChangeContainer_organization
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
