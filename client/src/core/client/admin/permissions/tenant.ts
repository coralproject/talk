import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import { mapValues } from "lodash";
import { PermissionMap } from "./types";

export type AbilityType =
  | "CHANGE_CONFIGURATION"
  | "INVITE_USERS"
  | "VIEW_STATISTICS";
interface PermissionContext {
  TODO: never;
}

const permissionMap: PermissionMap<AbilityType, PermissionContext> = {
  CHANGE_CONFIGURATION: {
    [GQLUSER_ROLE.ADMIN]: () => true,
  },
  INVITE_USERS: {
    [GQLUSER_ROLE.ADMIN]: () => true,
  },
  VIEW_STATISTICS: {
    [GQLUSER_ROLE.ADMIN]: () => true,
    [GQLUSER_ROLE.MODERATOR]: () => true,
  },
};

export const Ability = mapValues(permissionMap, (_, key) => key) as {
  [P in AbilityType]: P;
};

export function can(
  viewer: { role: GQLUSER_ROLE_RL },
  ability: AbilityType,
  ctx?: PermissionContext
) {
  return !!permissionMap[ability][viewer.role]?.(ctx);
}
