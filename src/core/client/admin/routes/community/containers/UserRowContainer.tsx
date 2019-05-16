import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { UserRowContainer_user as UserData } from "coral-admin/__generated__/UserRowContainer_user.graphql";
import { UserRowContainer_viewer as ViewerData } from "coral-admin/__generated__/UserRowContainer_viewer.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { Ability, can } from "coral-admin/permissions";
import UserRow from "../components/UserRow";

interface Props {
  user: UserData;
  viewer: ViewerData;
}

const UserRowContainer: FunctionComponent<Props> = props => {
  const { locales } = useCoralContext();
  return (
    <UserRow
      user={props.user}
      userID={props.user.id}
      username={props.user.username!}
      email={props.user.email}
      memberSince={new Intl.DateTimeFormat(locales, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(props.user.createdAt))}
      role={props.user.role}
      canChangeRole={
        props.viewer.id !== props.user.id &&
        can(props.viewer, Ability.CHANGE_ROLE)
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRowContainer_viewer on User {
      id
      role
    }
  `,
  user: graphql`
    fragment UserRowContainer_user on User {
      ...UserStatusChangeContainer_user
      id
      username
      email
      createdAt
      role
    }
  `,
})(UserRowContainer);

export default enhanced;
