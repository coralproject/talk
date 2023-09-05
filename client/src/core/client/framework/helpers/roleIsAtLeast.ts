import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

const hierarchy: GQLUSER_ROLE_RL[] = [
  GQLUSER_ROLE.COMMENTER,
  GQLUSER_ROLE.MEMBER,
  GQLUSER_ROLE.STAFF,
  GQLUSER_ROLE.MODERATOR,
  GQLUSER_ROLE.ADMIN,
];
export default function roleIsAtLeast(
  role: GQLUSER_ROLE_RL,
  atLeast: GQLUSER_ROLE_RL
) {
  [role, atLeast].forEach((r) => {
    if (!hierarchy.includes(r)) {
      throw new Error(`Unknown role ${r}`);
    }
  });
  return hierarchy.indexOf(atLeast) <= hierarchy.indexOf(role);
}
