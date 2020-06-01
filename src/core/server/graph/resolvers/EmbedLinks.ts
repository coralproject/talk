import {
  GQLEmbedLinksConfiguration,
  GQLEmbedLinksConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const EmbedLinksConfiguration: GQLEmbedLinksConfigurationTypeResolver<GQLEmbedLinksConfiguration> = {
  twitterEnabled: ({ twitterEnabled }) =>
    twitterEnabled ? twitterEnabled : false,
  youtubeEnabled: ({ youtubeEnabled }) =>
    youtubeEnabled ? youtubeEnabled : false,
};
