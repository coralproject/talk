import TenantContext from "coral-server/graph/tenant/context";
import { GQLCreateSiteInput } from "coral-server/graph/tenant/schema/__generated__/types";
import { Site } from "coral-server/models/site";
import { create } from "coral-server/services/sites";

export const Sites = (ctx: TenantContext) => ({
  create: async (input: GQLCreateSiteInput): Promise<Readonly<Site> | null> =>
    create(ctx.mongo, ctx.tenant, input.site, ctx.now),
});
