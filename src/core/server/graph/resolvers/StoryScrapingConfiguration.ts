import {
  GQLStoryScrapingConfiguration,
  GQLStoryScrapingConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const StoryScrapingConfiguration: GQLStoryScrapingConfigurationTypeResolver<Partial<
  GQLStoryScrapingConfiguration
>> = {
  authentication: ({ authentication }) =>
    authentication ? authentication : false,
  username: ({ username }) => username,
  password: ({ password }) => password,
};
