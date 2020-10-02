import {
  GQLStoryRatings,
  GQLStoryRatingsTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const StoryRatings: GQLStoryRatingsTypeResolver<GQLStoryRatings> = {
  // All averages are returned with only 1 decimal of precision. The following
  // ensures that the average is truncated but is still returned as a float.
  average: ({ average }) => Math.floor(average * 10) / 10,
};
