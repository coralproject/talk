import { isSiteModerationScoped } from "./isSiteModerationScoped";
import { User } from "./types";

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
  // if viewer is admin, yes
  if (viewer.role === "ADMIN") {
    return true;
  }

  // if viewer is moderator, sub function
  if (viewer.role !== "MODERATOR") {
    return false;
  }

  // if viewer moderator is scoped, false
  if (isSiteModerationScoped(viewer.moderationScopes)) {
    return false;
  }

  // if user is unscoped, false
  if (
    user.role === "MODERATOR" &&
    !isSiteModerationScoped(user.moderationScopes)
  ) {
    return false;
  }

  return true;
};
