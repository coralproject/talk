import { LocalProfile, User } from "coral-server/models/user";

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
