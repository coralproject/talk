import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions/user";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

import { UserRoleChangeContainer_settings } from "coral-admin/__generated__/UserRoleChangeContainer_settings.graphql";
import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";
import { isOrgModerator } from "coral-common/permissions/types";

import ButtonPadding from "../ButtonPadding";
import SiteRoleActions from "./SiteRoleActions";
import UpdateUserMembershipScopesMutation from "./UpdateUserMembershipScopesMutation";
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
  const updateUserRole = useMutation(UpdateUserRoleMutation);
  const updateUserModerationScopes = useMutation(
    UpdateUserModerationScopesMutation
  );
  const updateUserMembershipScopes = useMutation(
    UpdateUserMembershipScopesMutation
  );
  const handleOnChangeRole = useCallback(
    async (role: GQLUSER_ROLE_RL, siteIDs?: string[]) => {
      await updateUserRole({ userID: user.id, role, siteIDs });
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

  const handleOnChangeMembershipScopes = useCallback(
    async (siteIDs: string[]) => {
      /* eslint-disable */
      console.log("changing membership scopes");
      await updateUserMembershipScopes({
        userID: user.id,
        membershipScopes: {
          siteIDs,
        },
      });
    },
    [updateUserMembershipScopes, user.id]
  );

  const canChangeRole =
    viewer.id !== user.id && can(viewer, Ability.CHANGE_ROLE, { user, viewer });

  const moderationScopesEnabled = settings.multisite;

  if (viewer.role !== GQLUSER_ROLE.ADMIN && !isOrgModerator(viewer)) {
    return <SiteRoleActions viewer={viewer} user={user} />;
  }

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
      user={user}
      onChangeRole={handleOnChangeRole}
      onChangeModerationScopes={handleOnChangeModerationScopes}
      onChangeMembershipScopes={handleOnChangeMembershipScopes}
      moderationScopesEnabled={moderationScopesEnabled}
      viewer={viewer}
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
        sites {
          id
        }
      }
      ...SiteRoleActions_viewer
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
      membershipScopes {
        scoped
        sites {
          id
          name
        }
      }
      ...SiteRoleActions_user
    }
  `,
  settings: graphql`
    fragment UserRoleChangeContainer_settings on Settings {
      multisite
    }
  `,
})(UserRoleChangeContainer);

export default enhanced;
