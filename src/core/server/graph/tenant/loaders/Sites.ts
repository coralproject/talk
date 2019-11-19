import DataLoader from "dataloader";
import { defaultTo, isNull } from "lodash";

import TenantContext from "coral-server/graph/tenant/context";
import { Community } from "coral-server/models/community";
import {
  retrieveManyConsolidatedSettings,
  retrieveManySites,
  retrieveSite,
  retrieveSiteConnection,
  Site,
  SiteConnectionInput,
} from "coral-server/models/site";

import { createManyBatchLoadFn } from "./util";

function getSiteCommunityIDs(sites: (Site | null)[]): string[] {
  return sites
    .filter((s: Site | null) => !isNull(s))
    .map((s: Site) => s.communityID);
}

export default (ctx: TenantContext) => ({
  find: new DataLoader(
    createManyBatchLoadFn((id: string) =>
      retrieveSite(ctx.mongo, ctx.tenant.id, id)
    )
  ),
  site: new DataLoader<string, Site | null>(
    ids => retrieveManySites(ctx.mongo, ctx.tenant.id, ids),
    {
      cache: !ctx.disableCaching,
    }
  ),
  connection: ({ first, after, filter }: SiteConnectionInput) =>
    retrieveSiteConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter,
    }),
  settings: new DataLoader(async (ids: string[]) => {
    const sites: (Site | null)[] = await ctx.loaders.Sites.site.loadMany(ids);
    const communities: (Community | null)[] = await ctx.loaders.Communities.community.loadMany(
      getSiteCommunityIDs(sites)
    );
    return retrieveManyConsolidatedSettings(
      ctx.tenant,
      ids,
      communities,
      sites
    );
  }),
});
