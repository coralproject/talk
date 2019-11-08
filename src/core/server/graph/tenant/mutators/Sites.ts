import TenantContext from "coral-server/graph/tenant/context";
import { Site } from "coral-server/models/site";
import { create } from "coral-server/services/sites";

import { GQLCreateSiteInput } from "coral-server/graph/tenant/schema/__generated__/types";

export const Sites = (ctx: TenantContext) => ({
  create: async ({
    communityID,
    ...rest
  }: GQLCreateSiteInput): Promise<Readonly<Site | null>> =>
    create(ctx.mongo, ctx.tenant, communityID, rest, ctx.now),
});
