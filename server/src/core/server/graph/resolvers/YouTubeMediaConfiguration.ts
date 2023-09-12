import {
  GQLYouTubeMediaConfiguration,
  GQLYouTubeMediaConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const YouTubeMediaConfiguration: Required<
  GQLYouTubeMediaConfigurationTypeResolver<
    Partial<GQLYouTubeMediaConfiguration>
  >
> = {
  enabled: ({ enabled = false }) => enabled,
};
