import {
  GQLMediaConfiguration,
  GQLMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const MediaConfiguration: GQLMediaConfigurationTypeResolver<
  Partial<GQLMediaConfiguration>
> = {
  twitter: ({ twitter = {} }) => twitter,
  bluesky: ({ bluesky = {} }) => bluesky,
  youtube: ({ youtube = {} }) => youtube,
  gifs: ({ gifs = {} }) => gifs,
  external: () => ({}),
};
