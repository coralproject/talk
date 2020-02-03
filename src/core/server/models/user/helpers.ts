import { isEqual } from "lodash";

import { SSOUserProfile } from "coral-server/app/middleware/passport/strategies/verifiers/sso";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { STAFF_ROLES } from "./constants";
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

export function getUserProfile(
  user: Pick<User, "profiles">,
  type: Profile["type"]
) {
  if (!user.profiles) {
    return null;
  }

  return user.profiles.find(p => p.type === type) || null;
}

export function getSSOProfile(user: Pick<User, "profiles">) {
  return getUserProfile(user, "sso") as SSOProfile | null;
}

export function needsSSOUpdate(
  token: SSOUserProfile,
  user: Pick<User, "email" | "username" | "badges" | "role">
) {
  return (
    user.email !== token.email ||
    user.username !== token.username ||
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
