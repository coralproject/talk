import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

import { UserRoleChangeContainer_query } from "coral-admin/__generated__/UserRoleChangeContainer_query.graphql";
import { UserRoleChangeContainer_settings } from "coral-admin/__generated__/UserRoleChangeContainer_settings.graphql";
import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";

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
    [updateUserModerationScopes, user.id]
  );

  const canChangeRole =
    viewer.id !== user.id && can(viewer, Ability.CHANGE_ROLE);

  const isMultisite = settings.multisite;

  const canPromoteDemote =
    viewer.id !== user.id &&
    viewer.role === GQLUSER_ROLE.MODERATOR &&
    !!viewer.moderationScopes?.scoped;

  if (canPromoteDemote) {
    return <SiteModeratorActions viewer={viewer} user={user} />;
  }

  if (!canChangeRole) {
    return (
      <ButtonPadding>
        <UserRoleText
          isMultisite={isMultisite}
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
      isMultisite={isMultisite}
      query={query}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRoleChangeContainer_viewer on User {
      id
      role
      moderationScopes {
        scoped
      }
      ...SiteModeratorActions_viewer
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
      ...SiteModeratorActions_user
    }
  `,
  settings: graphql`
    fragment UserRoleChangeContainer_settings on Settings {
      multisite
    }
  `,
  query: graphql`
    fragment UserRoleChangeContainer_query on Query {
      ...SiteModeratorModalSiteFieldContainer_query
    }
  `,
})(UserRoleChangeContainer);

export default enhanced;
