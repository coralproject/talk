import * as site from "coral-server/models/site";
import { canModerate } from "coral-server/models/user/helpers";

import { GQLSiteTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Site: GQLSiteTypeResolver<site.Site> = {
  // We know the user is provided because this edge is authenticated.
  canModerate: ({ id }, args, ctx) => canModerate(ctx.user!, { siteID: id }),
};
