import { mapValues } from "lodash";

import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

/**
 * permissionMap describes what abilities certain roles have.
 *
 * This list is currently manually managed. We want to
 * get to a point where this is generated from the schema.
 *
 * We currently specify in the comments which endpoints of
 * the graph is important for the ability, which we can later
 * used to auto generate the map making the schema become
 * the single point of truth.
 */
const permissionMap = {
  // Mutation.updateSettings
  CHANGE_CONFIGURATION: [GQLUSER_ROLE.ADMIN],
  // Mutation.updateUserRole
  CHANGE_ROLE: [GQLUSER_ROLE.ADMIN],
  // Mutation.openStory
  // Mutation.closeStory
  CHANGE_STORY_STATUS: [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR],
  // Mutation.inviteUsers
  INVITE_USERS: [GQLUSER_ROLE.ADMIN],
  VIEW_STATISTICS: [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR],
  // Mutation.archiveStories, Mutation.unarchiveStories
  ARCHIVE_STORY: [GQLUSER_ROLE.ADMIN],
};

export type AbilityType = keyof typeof permissionMap;
export const Ability = mapValues(permissionMap, (_, key) => key) as {
  [P in AbilityType]: P;
};

/**
 * can is used to check if the `viewer` has permission for `ability`.
 *
 * Example: `can(props.me, Ability.CHANGE_ROLE)`.
 */
export function can(viewer: { role: GQLUSER_ROLE_RL }, ability: AbilityType) {
  return permissionMap[ability].includes(viewer.role as GQLUSER_ROLE);
}
