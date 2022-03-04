import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { GQLUSER_STATUS } from "coral-framework/schema";

import { UserStatusContainer_user$key as UserStatusContainer_user } from "coral-admin/__generated__/UserStatusContainer_user.graphql";

import UserStatus from "./UserStatus";

interface Props {
  user: UserStatusContainer_user;
  moderationScopesEnabled: boolean;
}

const UserStatusContainer: FunctionComponent<Props> = ({
  user,
  moderationScopesEnabled,
}) => {
  const userData = useFragment(
    graphql`
      fragment UserStatusContainer_user on User {
        status {
          current
          ban {
            sites {
              id
            }
          }
        }
      }
    `,
    user
  );

  return (
    <UserStatus
      banned={userData.status.current.includes(GQLUSER_STATUS.BANNED)}
      moderationScopesEnabled={moderationScopesEnabled}
      bannedSiteCount={userData.status.ban?.sites?.length}
      suspended={userData.status.current.includes(GQLUSER_STATUS.SUSPENDED)}
      premod={userData.status.current.includes(GQLUSER_STATUS.PREMOD)}
      warned={userData.status.current.includes(GQLUSER_STATUS.WARNED)}
    />
  );
};

export default UserStatusContainer;
