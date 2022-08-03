import {
  Ability as StoryAbility,
  AbilityType as StoryAbilityType,
  can as canForStory,
} from "coral-admin/permissions/story";
import {
  Ability as TenantAbility,
  AbilityType as TenantAbilityType,
  can as canForTenant,
} from "coral-admin/permissions/tenant";
import {
  Ability as UserAbility,
  AbilityType as UserAbilityType,
  can as canForUser,
} from "coral-admin/permissions/user";
import { GQLUSER_ROLE_RL } from "coral-framework/schema";

export type GeneralAbilityType =
  | StoryAbilityType
  | UserAbilityType
  | TenantAbilityType;

/**
 * For checking whether or not a viewer can
 * perform an action on any resource. The action may
 * still be disallowed on specific resources.
 */
export const canInGeneral = (
  viewer: { role: GQLUSER_ROLE_RL },
  ability: GeneralAbilityType
) => {
  if (ability === undefined) {
    return false;
  }
  if (ability in StoryAbility) {
    return canForStory(viewer, ability as StoryAbilityType);
  }

  if (ability in TenantAbility) {
    return canForTenant(viewer, ability as TenantAbilityType);
  }

  if (ability in UserAbility) {
    return canForUser(viewer, ability as UserAbilityType);
  }

  throw new Error(`Unknown ability type ${ability}`);
};
