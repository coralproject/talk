import { GQLCommunityTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import * as community from "coral-server/models/community";

export const Community: GQLCommunityTypeResolver<community.Community> = {
  consolidatedSettings: (s, input, ctx) =>
    ctx.loaders.Communities.settings.load(s.id),
  // sites: (s, input, ctx) => ctx.loaders.Sites.forCommunity(s.id),
};
