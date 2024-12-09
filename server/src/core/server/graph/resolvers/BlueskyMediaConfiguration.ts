import {
  GQLBlueskyMediaConfiguration,
  GQLBlueskyMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const BlueskyMediaConfiguration: Required<
  GQLBlueskyMediaConfigurationTypeResolver<
    Partial<GQLBlueskyMediaConfiguration>
  >
> = {
  enabled: ({ enabled = false }) => enabled,
};
