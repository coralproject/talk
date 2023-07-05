import {
  GQLMediaConfiguration,
  GQLMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const MediaConfiguration: GQLMediaConfigurationTypeResolver<
  Partial<GQLMediaConfiguration>
> = {
  twitter: ({ twitter = {} }) => twitter,
  youtube: ({ youtube = {} }) => youtube,
  giphy: ({ giphy = {} }) => giphy,
  external: () => ({}),
};
