import TenantContext from "coral-server/graph/context";
import {
  GQLCreateSiteInput,
  GQLUpdateSiteInput,
} from "coral-server/graph/schema/__generated__/types";
import { Site } from "coral-server/models/site";
import { create, update } from "coral-server/services/sites";

export const Sites = (ctx: TenantContext) => ({
  create: async (input: GQLCreateSiteInput): Promise<Readonly<Site> | null> =>
    create(
      ctx.mongo,
      ctx.redis,
      ctx.tenantCache,
      ctx.config,
      ctx.tenant,
      input.site,
      ctx.now
    ),
  update: async (input: GQLUpdateSiteInput): Promise<Readonly<Site> | null> =>
    update(ctx.mongo, ctx.tenant, input.id, input.site, ctx.now),
});
