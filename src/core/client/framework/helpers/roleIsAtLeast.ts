import { GQLUSER_ROLE } from "coral-common/schema";

const hierarchy: GQLUSER_ROLE[] = [
  GQLUSER_ROLE.COMMENTER,
  GQLUSER_ROLE.STAFF,
  GQLUSER_ROLE.MODERATOR,
  GQLUSER_ROLE.ADMIN,
];
export default function roleIsAtLeast(
  role: GQLUSER_ROLE,
  atLeast: GQLUSER_ROLE
) {
  [role, atLeast].forEach((r) => {
    if (!hierarchy.includes(r)) {
      throw new Error(`Unknown role ${r}`);
    }
  });
  return hierarchy.indexOf(atLeast) <= hierarchy.indexOf(role);
}
