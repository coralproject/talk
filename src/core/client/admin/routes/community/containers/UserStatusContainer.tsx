import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { UserStatusContainer_user as UserData } from "talk-admin/__generated__/UserStatusContainer_user.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { GQLUSER_STATUS } from "talk-framework/schema";

import UserStatus from "../components/UserStatus";

interface Props {
  user: UserData;
}

const UserStatusContainer: StatelessComponent<Props> = props => {
  return (
    <UserStatus
      banned={props.user.status.current.includes(GQLUSER_STATUS.BANNED)}
      suspended={props.user.status.current.includes(GQLUSER_STATUS.SUSPENDED)}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserStatusContainer_user on User {
      status {
        current
      }
    }
  `,
})(UserStatusContainer);

export default enhanced;
