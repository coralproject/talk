import * as site from "coral-server/models/site";
import { hasFeatureFlag } from "coral-server/models/tenant";
import {
  canModerate,
  hasModeratorRole,
} from "coral-server/models/user/helpers";

import {
  GQLFEATURE_FLAG,
  GQLSiteTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const Site: GQLSiteTypeResolver<site.Site> = {
  canModerate: ({ id }, args, ctx) => {
    if (!ctx.user) {
      return false;
    }

    // If the feature flag for site moderators is not turned on return based on
    // the users role.
    if (!hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      return hasModeratorRole(ctx.user);
    }

    return canModerate(ctx.user, { siteID: id });
  },
};
