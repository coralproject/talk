import * as site from "coral-server/models/site";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { canModerate } from "coral-server/models/user/helpers";

import {
  GQLFEATURE_FLAG,
  GQLSiteTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const Site: GQLSiteTypeResolver<site.Site> = {
  canModerate: ({ id }, args, ctx) => {
    // If the feature flag for site moderators is not turned on return true
    // always as this route is protected already against role mismatches.
    if (!hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      return true;
    }

    // We know the user is provided because this edge is authenticated.
    return canModerate(ctx.user!, { siteID: id });
  },
};
