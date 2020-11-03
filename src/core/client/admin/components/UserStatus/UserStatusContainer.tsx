import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG, GQLUSER_STATUS } from "coral-framework/schema";

import { UserStatusContainer_settings } from "coral-admin/__generated__/UserStatusContainer_settings.graphql";
import { UserStatusContainer_user } from "coral-admin/__generated__/UserStatusContainer_user.graphql";

import UserStatus from "./UserStatus";

interface Props {
  user: UserStatusContainer_user;
  settings: UserStatusContainer_settings;
}

const UserStatusContainer: FunctionComponent<Props> = (props) => {
  const moderationScopesEnabled =
    props.settings.featureFlags.includes(GQLFEATURE_FLAG.SITE_MODERATOR) &&
    props.settings.multisite;

  return (
    <UserStatus
      banned={
        props.user.status.current.includes(GQLUSER_STATUS.BANNED) ||
        props.user.status.ban?.sites?.length !== 0
      }
      moderationScopesEnabled={moderationScopesEnabled}
      bannedSiteCount={props.user.status.ban?.sites?.length}
      suspended={props.user.status.current.includes(GQLUSER_STATUS.SUSPENDED)}
      premod={props.user.status.current.includes(GQLUSER_STATUS.PREMOD)}
      warned={props.user.status.current.includes(GQLUSER_STATUS.WARNED)}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
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
  settings: graphql`
    fragment UserStatusContainer_settings on Settings {
      multisite
      featureFlags
    }
  `,
})(UserStatusContainer);

export default enhanced;
