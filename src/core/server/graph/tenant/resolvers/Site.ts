import * as community from "coral-server/models/community";
import * as site from "coral-server/models/site";

import { GQLSiteTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

export const Site: GQLSiteTypeResolver<site.Site> = {
  consolidatedSettings: (s, input, ctx) =>
    site.retrieveConsolidatedSettings(ctx.mongo, ctx.tenant, s.id),
  community: (s, input, ctx) =>
    community.retrieveCommunity(ctx.mongo, ctx.tenant.id, s.communityID),
};
