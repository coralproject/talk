import { isEqual } from "lodash";

import { SSOUserProfile } from "coral-server/app/middleware/passport/strategies/verifiers/sso";
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { isSiteModerationScoped } from "coral-common/permissions";

import { MODERATOR_ROLES, STAFF_ROLES } from "./constants";
import { LocalProfile, Profile, SSOProfile, User } from "./user";

export function roleIsStaff(role: GQLUSER_ROLE) {
  if (STAFF_ROLES.includes(role)) {
    return true;
  }

  return false;
}

export function hasStaffRole(user: Pick<User, "role">) {
  return roleIsStaff(user.role);
}

function roleIsModerator(role: GQLUSER_ROLE) {
  if (MODERATOR_ROLES.includes(role)) {
    return true;
  }

  return false;
}

export function hasModeratorRole(user: Pick<User, "role">) {
  return roleIsModerator(user.role);
}

/**
 * isSiteBanned is used to determine if the user is banned on the specific site.
 *
 * @param user the user to test if they are banned on a site
 * @param siteID id of the site to check to see if the user is banned on
 */
export function isSiteBanned(
  user: Pick<User, "status">,
  siteID: string
): boolean {
  return !!user.status.ban.siteIDs?.includes(siteID);
}

/**
 * canModerateUnscoped will check if a given user is unscoped (without any
 * restrictions) on their moderation capacity.
 *
 * @param user the user being checked for moderation scopes
 */
export function canModerateUnscoped(
  user: Pick<User, "role" | "moderationScopes">
) {
  // You can't possibly be a global moderator if you don't at least have a
  // moderator compatible role.
  if (!hasModeratorRole(user)) {
    return false;
  }

  // If you specifically have a moderator role, then if there is a siteID
  // restricting which sites you can moderate on, then you are not a global
  // moderator.
  if (
    user.role === GQLUSER_ROLE.MODERATOR &&
    isSiteModerationScoped(user.moderationScopes)
  ) {
    return false;
  }

  return true;
}

export interface ModerationScopeResource {
  siteID?: string;
}

/**
 * canModerate checks against the moderation scopes to determine if the current
 * user can moderate the given scope.
 *
 * @param user the user to check moderation scopes on
 * @param scopes the scopes to check against
 */
export function canModerate(
  user: Pick<User, "role" | "moderationScopes">,
  { siteID }: ModerationScopeResource
) {
  // You can't possibly moderate if you don't at least have a moderator
  // compatible role.
  if (!hasModeratorRole(user)) {
    return false;
  }

  // If the user is a moderator, then if the user is scoped to only moderate
  // specific sites, then ensure they can moderate _this_ siteID.
  if (
    user.role === GQLUSER_ROLE.MODERATOR &&
    user.moderationScopes &&
    siteID &&
    user.moderationScopes.siteIDs &&
    user.moderationScopes.siteIDs.length > 0 &&
    !user.moderationScopes.siteIDs.includes(siteID)
  ) {
    return false;
  }

  // The moderator does not have any scopes that prevent them from moderating
  // this comment.
  return true;
}

export function getUserProfile(
  user: Pick<User, "profiles">,
  type: Profile["type"]
) {
  if (!user.profiles) {
    return null;
  }

  return user.profiles.find((p) => p.type === type) || null;
}

export function getSSOProfile(user: Pick<User, "profiles">) {
  return getUserProfile(user, "sso") as SSOProfile | null;
}

export function needsSSOUpdate(
  token: SSOUserProfile,
  user: Pick<
    User,
    "email" | "username" | "badges" | "role" | "ssoURL" | "avatar"
  >
) {
  return (
    user.email !== token.email ||
    user.username !== token.username ||
    user.avatar !== token.avatar ||
    user.ssoURL !== token.url ||
    (token.role && user.role !== token.role) ||
    !isEqual(user.badges, token.badges)
  );
}

/**
 * getLocalProfile will get the LocalProfile from the User if it exists.
 *
 * @param user the User to pull the LocalProfile out of
 */
export function getLocalProfile(
  user: Pick<User, "profiles">,
  withEmail?: string
): LocalProfile | undefined {
  const profile = getUserProfile(user, "local") as LocalProfile | null;
  if (!profile) {
    return;
  }

  if (withEmail && profile.id !== withEmail) {
    return;
  }

  return profile;
}

/**
 * hasLocalProfile will return true if the User has a LocalProfile, optionally
 * checking the email on it as well.
 *
 * @param user the User to pull the LocalProfile out of
 * @param withEmail when specified, will ensure that the LocalProfile has the
 *                  specific email provided
 */
export function hasLocalProfile(
  user: Pick<User, "profiles">,
  withEmail?: string
): boolean {
  const profile = getLocalProfile(user, withEmail);
  if (!profile) {
    return false;
  }

  return true;
}

/**
 * hasSSOProfile will return true if the User has an SSOProfile and false
 * if they do not.
 *
 * @param user the User to pull the SSOProfile out of
 */
export function hasSSOProfile(user: Pick<User, "profiles">): boolean {
  const profile = getUserProfile(user, "sso") as SSOProfile | null;
  return profile ? true : false;
}
