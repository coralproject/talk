import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG, GQLUSER_ROLE_RL } from "coral-framework/schema";

import { UserRoleChangeContainer_query } from "coral-admin/__generated__/UserRoleChangeContainer_query.graphql";
import { UserRoleChangeContainer_settings } from "coral-admin/__generated__/UserRoleChangeContainer_settings.graphql";
import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";

import ButtonPadding from "../ButtonPadding";
import UpdateUserModerationScopesMutation from "./UpdateUserModerationScopesMutation";
import UpdateUserRoleMutation from "./UpdateUserRoleMutation";
import UserRoleChange from "./UserRoleChange";
import UserRoleText from "./UserRoleText";

interface Props {
  viewer: UserRoleChangeContainer_viewer;
  user: UserRoleChangeContainer_user;
  settings: UserRoleChangeContainer_settings;
  query: UserRoleChangeContainer_query;
}

const UserRoleChangeContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  settings,
  query,
}) => {
  const updateUserRole = useMutation(UpdateUserRoleMutation);
  const updateUserModerationScopes = useMutation(
    UpdateUserModerationScopesMutation
  );
  const handleOnChangeRole = useCallback(
    async (role: GQLUSER_ROLE_RL) => {
      if (role === user.role) {
        // No role change is needed! User already has the selected role.
        return;
      }

      await updateUserRole({ userID: user.id, role });
    },
    [user, updateUserRole]
  );
  const handleOnChangeModerationScopes = useCallback(
    async (siteIDs: string[]) => {
      await updateUserModerationScopes({
        userID: user.id,
        moderationScopes: { siteIDs },
      });
    },
    [user]
  );
  const canChangeRole = useMemo(
    () => viewer.id !== user.id && can(viewer, Ability.CHANGE_ROLE),
    [viewer, user]
  );

  const moderationScopesEnabled = useMemo(
    () =>
      settings.featureFlags.includes(GQLFEATURE_FLAG.SITE_MODERATOR) &&
      settings.multisite,
    [settings]
  );

  if (!canChangeRole) {
    return (
      <ButtonPadding>
        <UserRoleText
          moderationScopesEnabled={moderationScopesEnabled}
          scoped={user.moderationScopes?.scoped}
          role={user.role}
        />
      </ButtonPadding>
    );
  }

  return (
    <UserRoleChange
      username={user.username}
      onChangeRole={handleOnChangeRole}
      onChangeModerationScopes={handleOnChangeModerationScopes}
      role={user.role}
      scoped={user.moderationScopes?.scoped}
      moderationScopes={user.moderationScopes}
      moderationScopesEnabled={moderationScopesEnabled}
      query={query}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRoleChangeContainer_viewer on User {
      id
      role
    }
  `,
  user: graphql`
    fragment UserRoleChangeContainer_user on User {
      id
      username
      role
      moderationScopes {
        scoped
        sites {
          id
          name
        }
      }
    }
  `,
  settings: graphql`
    fragment UserRoleChangeContainer_settings on Settings {
      multisite
      featureFlags
    }
  `,
  query: graphql`
    fragment UserRoleChangeContainer_query on Query {
      ...SiteModeratorModalSiteFieldContainer_query
    }
  `,
})(UserRoleChangeContainer);

export default enhanced;
