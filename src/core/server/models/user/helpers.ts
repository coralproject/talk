import { isEqual } from "lodash";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { SSOUserProfile } from "coral-server/app/middleware/passport/strategies/verifiers/sso";
import { STAFF_ROLES } from "./constants";
import { LocalProfile, SSOProfile, User } from "./user";

export function roleIsStaff(role: GQLUSER_ROLE) {
  if (STAFF_ROLES.includes(role)) {
    return true;
  }

  return false;
}

export function hasStaffRole(user: Pick<User, "role">) {
  return roleIsStaff(user.role);
}

export function getSSOProfile(user: Pick<User, "profiles">) {
  if (!user.profiles) {
    return;
  }

  return user.profiles.find(profile => profile.type === "sso") as
    | SSOProfile
    | undefined;
}

export function needsSSOUpdate(
  token: SSOUserProfile,
  user: Pick<User, "email" | "username" | "badges" | "role" | "ssoURL">
) {
  return (
    user.email !== token.email ||
    user.username !== token.username ||
    (user.ssoURL && user.ssoURL !== token.url) ||
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
  if (!user.profiles) {
    return;
  }

  const profile = user.profiles.find(({ type }) => type === "local") as
    | LocalProfile
    | undefined;

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
