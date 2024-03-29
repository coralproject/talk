import { roundRating } from "coral-common/common/lib/utils";

import {
  GQLStoryRatings,
  GQLStoryRatingsTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const StoryRatings: GQLStoryRatingsTypeResolver<GQLStoryRatings> = {
  average: ({ average }) => roundRating(average),
};
