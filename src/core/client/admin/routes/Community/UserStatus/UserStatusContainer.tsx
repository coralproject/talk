import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { UserStatusContainer_user as UserData } from "coral-admin/__generated__/UserStatusContainer_user.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_STATUS } from "coral-framework/schema";

import UserStatus from "./UserStatus";

interface Props {
  user: UserData;
}

const UserStatusContainer: FunctionComponent<Props> = props => {
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
