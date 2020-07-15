import {
  GQLMediaConfiguration,
  GQLMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const MediaConfiguration: GQLMediaConfigurationTypeResolver<GQLMediaConfiguration> = {
  twitter: ({ twitter }) => (twitter ? twitter : false),
  youtube: ({ youtube }) => (youtube ? youtube : false),
  giphy: ({ giphy }) => (giphy ? giphy : false),
};
