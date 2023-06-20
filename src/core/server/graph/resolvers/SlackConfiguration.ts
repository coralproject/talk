import {
  GQLSlackConfiguration,
  GQLSlackConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const SlackConfiguration: GQLSlackConfigurationResolvers<
  GraphContext,
  GQLSlackConfiguration
> = {
  // TODO: Remove this when we create a migration to generate slack channels on existing tenants
  channels: ({ channels = [] }) => channels,
};
