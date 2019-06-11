import { STAFF_ROLES } from "coral-server/models/user/constants";

import { User } from ".";

export async function userIsStaff(user: User) {
  if (STAFF_ROLES.includes(user.role)) {
    return true;
  }

  return false;
}
