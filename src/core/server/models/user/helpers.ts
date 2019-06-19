import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { STAFF_ROLES } from "coral-server/models/user/constants";

import { User } from ".";

export function roleIsStaff(role: GQLUSER_ROLE) {
  if (STAFF_ROLES.includes(role)) {
    return true;
  }

  return false;
}

export function userIsStaff(user: Pick<User, "role">) {
  return roleIsStaff(user.role);
}
