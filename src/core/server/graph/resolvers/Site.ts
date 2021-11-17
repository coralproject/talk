import * as site from "coral-server/models/site";
import { canModerate } from "coral-server/models/user/helpers";

import { GQLSiteTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Site: GQLSiteTypeResolver<site.Site> = {
  canModerate: ({ id }, args, ctx) => {
    if (!ctx.user) {
      return false;
    }

    return canModerate(ctx.user, { siteID: id });
  },
  topStories: async ({ id }, args, ctx) => {
    // Get the top Story ID's from the loader.
    const results = await ctx.loaders.Stories.topStories(id, args);

    // If there isn't any ids, then return nothing!
    if (results.length === 0) {
      return [];
    }

    // Get the Stories!
    return ctx.loaders.Stories.story.loadMany(results.map(({ _id }) => _id));
  },
};
