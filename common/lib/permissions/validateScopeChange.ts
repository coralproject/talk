import { isSiteModerationScoped } from "./isSiteModerationScoped";
import { isModerator, User } from "./types";

export interface ScopeChangeValidationParams {
  viewer: Readonly<User>;
  user: Readonly<User>;
  additions?: string[];
  deletions?: string[];
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

  // only admins and mods can change scopes
  if (!isModerator(viewer)) {
    return false;
  }

  if (user.role === "ADMIN") {
    return false;
  }

  if (
    user.role === "MODERATOR" &&
    !isSiteModerationScoped(user.moderationScopes)
  ) {
    return false;
  }

  const invalidAdditions =
    isSiteModerationScoped(viewer.moderationScopes) &&
    !!additions?.find(
      (addition) => !viewer.moderationScopes?.siteIDs?.includes(addition)
    );

  const invalidDeletions =
    isSiteModerationScoped(viewer.moderationScopes) &&
    !!deletions?.find(
      (deletion) => !viewer.moderationScopes?.siteIDs?.includes(deletion)
    );

  // if user is unscoped, false
  if (
    user.role === "MODERATOR" &&
    !isSiteModerationScoped(user.moderationScopes)
  ) {
    return false;
  }

  return !(invalidAdditions || invalidDeletions);
};
