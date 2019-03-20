import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { UserRowContainer_user as UserData } from "talk-admin/__generated__/UserRowContainer_user.graphql";
import { useTalkContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";

import UserRow from "../components/UserRow";

interface Props {
  user: UserData;
}

const UserRowContainer: StatelessComponent<Props> = props => {
  const { locales } = useTalkContext();
  return (
    <UserRow
      username={props.user.username!}
      email={props.user.email}
      memberSince={new Intl.DateTimeFormat(locales, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(new Date(props.user.createdAt))}
      role={props.user.role}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
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
