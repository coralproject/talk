import {
  GQLGIF_MEDIA_SOURCE,
  GQLGifMediaConfiguration,
  GQLGifMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const GifMediaConfiguration: GQLGifMediaConfigurationTypeResolver<
  Partial<GQLGifMediaConfiguration>
> = {
  enabled: ({ enabled = false }) => enabled,
  maxRating: ({ maxRating = "g" }) => maxRating,
  provider: ({ provider = GQLGIF_MEDIA_SOURCE.GIPHY }) => provider,
};
