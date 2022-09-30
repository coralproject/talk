import * as settings from "coral-server/models/settings";

import { GQLStoryScrapingConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const StoryScrapingConfiguration: GQLStoryScrapingConfigurationTypeResolver<settings.StoryScrapingConfiguration> =
  {
    authentication: ({ authentication }) => !!authentication,
  };
