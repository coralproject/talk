import {
  GQLSlackConfiguration,
  GQLSlackConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const SlackConfiguration: GQLSlackConfigurationTypeResolver<GQLSlackConfiguration> =
  {
    // TODO: Remove this when we create a migration to generate slack channels on existing tenants
    channels: ({ channels = [] }) => channels,
  };
