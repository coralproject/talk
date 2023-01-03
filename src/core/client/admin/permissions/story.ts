import {
  GQLStory,
  GQLUSER_ROLE,
  GQLUSER_ROLE_RL,
} from "coral-framework/schema";
import { mapValues } from "lodash";
import { PermissionMap } from "./types";

export type AbilityType = "CHANGE_STORY_STATUS" | "ARCHIVE_STORY";
interface PermissionContext {
  story: GQLStory;
}

const permissionMap: PermissionMap<AbilityType, PermissionContext> = {
  CHANGE_STORY_STATUS: {
    [GQLUSER_ROLE.ADMIN]: () => true,
    [GQLUSER_ROLE.MODERATOR]: () => true,
  },
  ARCHIVE_STORY: {
    [GQLUSER_ROLE.ADMIN]: () => false,
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
