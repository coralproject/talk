import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { UserRowContainer_user as UserData } from "talk-admin/__generated__/UserRowContainer_user.graphql";
import { UserRowContainer_viewer as ViewerData } from "talk-admin/__generated__/UserRowContainer_viewer.graphql";
import { useTalkContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";

import { Ability, can } from "talk-admin/permissions";
import UserRow from "../components/UserRow";

interface Props {
  user: UserData;
  viewer: ViewerData;
}

const UserRowContainer: StatelessComponent<Props> = props => {
  const { locales } = useTalkContext();
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
