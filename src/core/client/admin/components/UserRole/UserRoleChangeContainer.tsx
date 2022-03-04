import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

import { UserRoleChangeContainer_settings$key as UserRoleChangeContainer_settings } from "coral-admin/__generated__/UserRoleChangeContainer_settings.graphql";
import { UserRoleChangeContainer_user$key as UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer$key as UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";

import ButtonPadding from "../ButtonPadding";
import SiteModeratorActions from "./SiteModeratorActions";
import UpdateUserModerationScopesMutation from "./UpdateUserModerationScopesMutation";
import UpdateUserRoleMutation from "./UpdateUserRoleMutation";
import UserRoleChange from "./UserRoleChange";
import UserRoleText from "./UserRoleText";

interface Props {
  viewer: UserRoleChangeContainer_viewer;
  user: UserRoleChangeContainer_user;
  settings: UserRoleChangeContainer_settings;
}

const UserRoleChangeContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  settings,
}) => {
  const userData = useFragment(
    graphql`
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
        ...SiteModeratorActions_user
      }
    `,
    user
  );
  const viewerData = useFragment(
    graphql`
      fragment UserRoleChangeContainer_viewer on User {
        id
        role
        moderationScopes {
          scoped
        }
        ...SiteModeratorActions_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment UserRoleChangeContainer_settings on Settings {
        multisite
      }
    `,
    settings
  );

  const updateUserRole = useMutation(UpdateUserRoleMutation);
  const updateUserModerationScopes = useMutation(
    UpdateUserModerationScopesMutation
  );
  const handleOnChangeRole = useCallback(
    async (role: GQLUSER_ROLE_RL) => {
      if (role === userData.role) {
        // No role change is needed! User already has the selected role.
        return;
      }

      await updateUserRole({ userID: userData.id, role });
    },
    [userData, updateUserRole]
  );
  const handleOnChangeModerationScopes = useCallback(
    async (siteIDs: string[]) => {
      await updateUserModerationScopes({
        userID: userData.id,
        moderationScopes: { siteIDs },
      });
    },
    [updateUserModerationScopes, userData.id]
  );

  const canChangeRole =
    viewerData.id !== userData.id && can(viewerData, Ability.CHANGE_ROLE);

  const moderationScopesEnabled = settingsData.multisite;

  const canPromoteDemote =
    viewerData.id !== userData.id &&
    viewerData.role === GQLUSER_ROLE.MODERATOR &&
    !!viewerData.moderationScopes?.scoped;

  if (canPromoteDemote) {
    return <SiteModeratorActions viewer={viewerData} user={userData} />;
  }

  if (!canChangeRole) {
    return (
      <ButtonPadding>
        <UserRoleText
          moderationScopesEnabled={moderationScopesEnabled}
          scoped={userData.moderationScopes?.scoped}
          role={userData.role}
        />
      </ButtonPadding>
    );
  }

  return (
    <UserRoleChange
      username={userData.username}
      onChangeRole={handleOnChangeRole}
      onChangeModerationScopes={handleOnChangeModerationScopes}
      role={userData.role}
      scoped={userData.moderationScopes?.scoped}
      moderationScopes={userData.moderationScopes}
      moderationScopesEnabled={moderationScopesEnabled}
    />
  );
};

export default UserRoleChangeContainer;
