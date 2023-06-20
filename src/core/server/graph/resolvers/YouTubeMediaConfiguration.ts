import {
  GQLYouTubeMediaConfiguration,
  GQLYouTubeMediaConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const YouTubeMediaConfiguration: RequiredResolver<
  GQLYouTubeMediaConfigurationResolvers<
    GraphContext,
    Partial<GQLYouTubeMediaConfiguration>
  >
> = {
  enabled: ({ enabled = false }) => enabled,
};
