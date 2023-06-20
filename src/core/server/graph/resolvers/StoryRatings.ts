import { roundRating } from "coral-common/utils";

import {
  GQLStoryRatings,
  GQLStoryRatingsResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const StoryRatings: GQLStoryRatingsResolvers<
  GraphContext,
  GQLStoryRatings
> = {
  average: ({ average }) => roundRating(average),
};
