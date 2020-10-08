import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  GQLFEATURE_FLAG,
  GQLUSER_ROLE,
  GQLUSER_ROLE_RL,
} from "coral-framework/schema";

import { UserRoleChangeContainer_query } from "coral-admin/__generated__/UserRoleChangeContainer_query.graphql";
import { UserRoleChangeContainer_settings } from "coral-admin/__generated__/UserRoleChangeContainer_settings.graphql";
import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";

import ButtonPadding from "../ButtonPadding";
import PromoteUserRoleMutation from "./PromoteUserRoleMutation";
import UpdateUserModerationScopesMutation from "./UpdateUserModerationScopesMutation";
import UpdateUserRoleMutation from "./UpdateUserRoleMutation";
import UserRoleChange, { RoleDescription } from "./UserRoleChange";
import UserRoleText from "./UserRoleText";

interface Props {
  viewer: UserRoleChangeContainer_viewer;
  user: UserRoleChangeContainer_user;
  settings: UserRoleChangeContainer_settings;
  query: UserRoleChangeContainer_query;
}

function canChangeRole(viewer: RoleDescription, user: RoleDescription) {
  // cannot modify your own role
  if (viewer.id === user.id) {
    return false;
  }

  // admin's can do whatever they want
  if (viewer.role === GQLUSER_ROLE.ADMIN) {
    return true;
  }

  // staff and commenters can't do anything
  if ([GQLUSER_ROLE.STAFF, GQLUSER_ROLE.COMMENTER].includes(viewer.role)) {
    return false;
  }

  // organization moderators can update staff, commenters, and site mods
  if (viewer.role === GQLUSER_ROLE.MODERATOR && !viewer.scoped) {
    if ([GQLUSER_ROLE.COMMENTER, GQLUSER_ROLE.STAFF].includes(user.role)) {
      return true;
    }
    if (user.role === GQLUSER_ROLE.MODERATOR && user.scoped) {
      return true;
    }

    return false;
  }

  // site moderators can update staff and commenters
  if (viewer.role === GQLUSER_ROLE.MODERATOR && viewer.scoped) {
    if ([GQLUSER_ROLE.COMMENTER, GQLUSER_ROLE.STAFF].includes(user.role)) {
      return true;
    }

    return false;
  }

  return false;
}

const UserRoleChangeContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  settings,
  query,
}) => {
  const updateUserRole = useMutation(UpdateUserRoleMutation);
  const updateModerationScopes = useMutation(
    UpdateUserModerationScopesMutation
  );
  const promoteUser = useMutation(PromoteUserRoleMutation);

  const viewerCanChangeRole = useMemo(() => {
    return canChangeRole(
      {
        id: viewer.id,
        role: convertRole(viewer.role),
        scoped: !!viewer.moderationScopes && viewer.moderationScopes.scoped,
      },
      {
        id: user.id,
        role: convertRole(user.role),
        scoped: !!user.moderationScopes && user.moderationScopes.scoped,
      }
    );
  }, [viewer, user]);

  const moderationScopesEnabled = useMemo(
    () =>
      settings.featureFlags.includes(GQLFEATURE_FLAG.SITE_MODERATOR) &&
      settings.multisite,
    [settings]
  );

  const onChange = useCallback(
    async (role: GQLUSER_ROLE_RL, siteIDs?: string[]) => {
      // update their role
      await updateUserRole({ userID: user.id, role });

      // if we can use moderation scopes, update those too
      if (moderationScopesEnabled) {
        await updateModerationScopes({
          userID: user.id,
          moderationScopes: { siteIDs: siteIDs ? siteIDs : [] },
        });
      }
    },
    [updateUserRole, user.id, moderationScopesEnabled, updateModerationScopes]
  );
  const onPromote = useCallback(async () => {
    await promoteUser({
      userID: user.id,
    });
  }, [user, promoteUser]);

  if (!viewerCanChangeRole) {
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
      onChange={onChange}
      onPromote={onPromote}
      viewerRole={convertRole(viewer.role)}
      role={convertRole(user.role)}
      scoped={user.moderationScopes?.scoped}
      moderationScopes={user.moderationScopes}
      moderationScopesEnabled={moderationScopesEnabled}
      query={query}
      viewerScoped={
        viewer.moderationScopes ? viewer.moderationScopes?.scoped : false
      }
      viewerSites={
        viewer.moderationScopes
          ? viewer.moderationScopes.sites?.map((s) => s.id)
          : null
      }
    />
  );
};

function convertRole(role: GQLUSER_ROLE_RL): GQLUSER_ROLE {
  switch (role) {
    case GQLUSER_ROLE.ADMIN:
      return GQLUSER_ROLE.ADMIN;
    case GQLUSER_ROLE.MODERATOR:
      return GQLUSER_ROLE.MODERATOR;
    case GQLUSER_ROLE.STAFF:
      return GQLUSER_ROLE.STAFF;
    case GQLUSER_ROLE.COMMENTER:
      return GQLUSER_ROLE.COMMENTER;
    default:
      return GQLUSER_ROLE.COMMENTER;
  }
}

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
