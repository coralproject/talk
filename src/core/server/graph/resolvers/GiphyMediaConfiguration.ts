import {
  GQLGiphyMediaConfiguration,
  GQLGiphyMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const GiphyMediaConfiguration: GQLGiphyMediaConfigurationTypeResolver<
  Partial<GQLGiphyMediaConfiguration>
> = {
  enabled: ({ enabled = false }) => enabled,
  maxRating: ({ maxRating = "g" }) => maxRating,
};
