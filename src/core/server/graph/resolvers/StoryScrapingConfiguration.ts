import * as settings from "coral-server/models/settings";

import { GQLStoryScrapingConfigurationResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const StoryScrapingConfiguration: GQLStoryScrapingConfigurationResolvers<
  GraphContext,
  settings.StoryScrapingConfiguration
> = {
  authentication: ({ authentication }) => !!authentication,
};
