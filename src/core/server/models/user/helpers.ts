import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";

import { STAFF_ROLES } from "./constants";
import { LocalProfile, SSOProfile, User } from "./user";

export function roleIsStaff(role: GQLUSER_ROLE) {
  if (STAFF_ROLES.includes(role)) {
    return true;
  }

  return false;
}

export function userIsStaff(user: Pick<User, "role">) {
  return roleIsStaff(user.role);
}

export function getSSOProfile(user: Pick<User, "profiles">) {
  return user.profiles.find(profile => profile.type === "sso") as
    | SSOProfile
    | undefined;
}

export function needsSSOUpdate(
  token: Pick<User, "email" | "username">,
  user: Pick<User, "email" | "username">
) {
  return user.email !== token.email || user.username !== token.username;
}

/**
 * getLocalProfile will get the LocalProfile from the User if it exists.
 *
 * @param user the User to pull the LocalProfile out of
 */
export function getLocalProfile(
  user: Pick<User, "profiles">
): LocalProfile | undefined {
  return user.profiles.find(({ type }) => type === "local") as
    | LocalProfile
    | undefined;
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
  const profile = getLocalProfile(user);
  if (!profile) {
    return false;
  }

  if (withEmail && profile.id !== withEmail) {
    return false;
  }

  return true;
}
