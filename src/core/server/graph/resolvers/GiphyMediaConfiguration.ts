import {
  GQLGiphyMediaConfiguration,
  GQLGiphyMediaConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const GiphyMediaConfiguration: GQLGiphyMediaConfigurationResolvers<
  GraphContext,
  Partial<GQLGiphyMediaConfiguration>
> = {
  enabled: ({ enabled = false }) => enabled,
  maxRating: ({ maxRating = "g" }) => maxRating,
};
