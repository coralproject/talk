import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import { User } from "coral-server/models/user";
import { isSiteModerationScoped } from "coral-server/models/user/helpers";

export interface ScopeChangeValidationParams {
  viewer: Readonly<User>;
  user: Readonly<User>;
  additions: string[];
  deletions: string[];
}

export const validateScopeChange = ({
  viewer,
  user,
  additions,
  deletions,
}: ScopeChangeValidationParams): boolean => {
  if (viewer.tenantID !== user.tenantID) {
    return false;
  }
  // if viewer is admin, yes
  if (viewer.role === GQLUSER_ROLE.ADMIN) {
    return true;
  }

  // if viewer is moderator, sub function
  if (viewer.role !== GQLUSER_ROLE.MODERATOR) {
    return false;
  }

  // if viewer moderator is scoped, false
  if (isSiteModerationScoped(viewer.moderationScopes)) {
    return false;
  }

  // if user is unscoped, false
  if (
    user.role === GQLUSER_ROLE.MODERATOR &&
    !isSiteModerationScoped(user.moderationScopes)
  ) {
    return false;
  }

  return true;
};
