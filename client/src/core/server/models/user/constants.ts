import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export const MODERATOR_ROLES = [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR];

export const STAFF_ROLES = [
  GQLUSER_ROLE.ADMIN,
  GQLUSER_ROLE.MODERATOR,
  GQLUSER_ROLE.STAFF,
];
