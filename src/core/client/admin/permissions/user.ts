import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import { mapValues } from "lodash";
import { PermissionMap } from "./types";

interface ContextUser {
  role: GQLUSER_ROLE_RL;
  moderationScopes: {
    scoped: boolean;
  } | null;
}

export type AbilityType = "CHANGE_ROLE";
interface PermissionContext {
  viewer: ContextUser;
  user: ContextUser;
}

const permissionMap: PermissionMap<AbilityType, PermissionContext> = {
  CHANGE_ROLE: {
    [GQLUSER_ROLE.ADMIN]: (ctx) => ctx?.user.role !== GQLUSER_ROLE.ADMIN,
    [GQLUSER_ROLE.MODERATOR]: (ctx) => {
      if (!ctx) {
        return true;
      }

      if (ctx.user.role === GQLUSER_ROLE.ADMIN) {
        return false;
      }

      if (ctx.viewer.moderationScopes?.scoped) {
        return false;
      }

      if (
        ctx.user.role === GQLUSER_ROLE.MODERATOR &&
        !ctx.user.moderationScopes?.scoped
      ) {
        return false;
      }

      return true;
    },
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
