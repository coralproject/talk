import {
  GQLEmbedConfiguration,
  GQLEmbedConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const EmbedConfiguration: GQLEmbedConfigurationTypeResolver<GQLEmbedConfiguration> = {
  twitter: ({ twitter }) => (twitter ? twitter : false),
  youtube: ({ youtube }) => (youtube ? youtube : false),
};
