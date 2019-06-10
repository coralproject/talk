import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";

import { User } from ".";

export async function userIsStaff(user: User) {
  const staffRoles = [
    GQLUSER_ROLE.ADMIN,
    GQLUSER_ROLE.MODERATOR,
    GQLUSER_ROLE.STAFF,
  ];

  if (staffRoles.includes(user.role)) {
    return true;
  }

  return false;
}
