import { GQLUSER_ROLE_RL } from "coral-framework/schema";

export type PermissionMap<AbilityType extends string, ContextType> = {
  [abilityType in AbilityType]: {
    [role in GQLUSER_ROLE_RL]?: (context?: ContextType) => boolean;
  };
};
