import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { UserRowContainer_me as MeData } from "talk-admin/__generated__/UserRowContainer_me.graphql";
import { UserRowContainer_user as UserData } from "talk-admin/__generated__/UserRowContainer_user.graphql";
import { useTalkContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";

import { Ability, can } from "talk-admin/permissions";
import UserRow from "../components/UserRow";

interface Props {
  user: UserData;
  me: MeData;
}

const UserRowContainer: StatelessComponent<Props> = props => {
  const { locales } = useTalkContext();
  return (
    <UserRow
      userID={props.user.id}
      username={props.user.username!}
      email={props.user.email}
      memberSince={new Intl.DateTimeFormat(locales, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(new Date(props.user.createdAt))}
      role={props.user.role}
      canChangeRole={
        props.me.id !== props.user.id && can(props.me, Ability.CHANGE_ROLE)
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  me: graphql`
    fragment UserRowContainer_me on User {
      id
      role
    }
  `,
  user: graphql`
    fragment UserRowContainer_user on User {
      id
      username
      email
      createdAt
      role
    }
  `,
})(UserRowContainer);

export default enhanced;
