import { isSiteModerationScoped } from "./isSiteModerationScoped";
import { User, UserRole } from "./types";

const validateModeratorRoleChange = (
  viewer: Readonly<User>,
  user: Readonly<User>,
  role: UserRole
) => {
  // Org mods may promote users to site moderators within their scope,
  // but only if the user < org mod
  const viewerIsMod = viewer.role === "MODERATOR";
  const userIsMod = user.role === "MODERATOR";
  const viewerIsOrgMod =
    viewerIsMod && !isSiteModerationScoped(viewer.moderationScopes);
  const userIsSiteMod =
    userIsMod && isSiteModerationScoped(user.moderationScopes);
  const userIsNotMod = user.role !== "MODERATOR";

  if (
    viewerIsOrgMod &&
    (userIsSiteMod || userIsNotMod) &&
    role === "MODERATOR"
  ) {
    return true;
  }

  return false;
};

export const validateRoleChange = (
  viewer: Readonly<User>,
  user: Readonly<User>,
  role: UserRole
): boolean => {
  // User is admin
  if (user.role === "ADMIN") {
    return false;
  }

  // Viewer is changing their own role
  if (user.id === viewer.id) {
    return false;
  }

  // User is admin
  if (viewer.role === "ADMIN") {
    return true;
  }

  // User is org/site moderator
  if (viewer.role === "MODERATOR") {
    return validateModeratorRoleChange(viewer, user, role);
  }

  // No one else may update users roles
  return false;
};
