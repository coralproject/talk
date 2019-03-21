import { mapValues } from "lodash";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "talk-framework/schema";

export const permissionMap = {
  // Mutation.updateUserRole
  CHANGE_ROLE: [GQLUSER_ROLE.ADMIN],
};

export type AbilityType = keyof typeof permissionMap;
export const Ability = mapValues(permissionMap, (_, key) => key) as {
  [P in AbilityType]: P
};
export function can(viewer: { role: GQLUSER_ROLE_RL }, ability: AbilityType) {
  return permissionMap[ability].includes(viewer.role as GQLUSER_ROLE);
}
