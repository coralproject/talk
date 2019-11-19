import DataLoader from "dataloader";
import { defaultTo } from "lodash";
import { isNull } from "lodash";

import TenantContext from "coral-server/graph/tenant/context";
import { Community } from "coral-server/models/community";
import {
  retrieveConsolidatedSettings,
  retrieveManySites,
  retrieveSite,
  retrieveSiteConnection,
  Site,
  SiteConnectionInput,
} from "coral-server/models/site";

import { createManyBatchLoadFn } from "./util";

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
    const sites = await retrieveManySites(ctx.mongo, ctx.tenant.id, ids);
    const filteredSites = sites.filter(
      (s: Site | null) => !isNull(s)
    ) as Site[];
    const communities = await ctx.loaders.Communities.community.loadMany(
      filteredSites.map(s => s.communityID)
    );
    const filteredCommunities = communities.filter(
      (c: Community | null) => !isNull(c)
    ) as Community[];
    return Promise.resolve(
      ids.map(id => {
        const site = filteredSites.find(s => s.id === id);
        if (!site) {
          return null;
        }
        const community = filteredCommunities.find(
          c => c.id === site.communityID
        );
        if (!community) {
          return null;
        }
        return retrieveConsolidatedSettings(ctx.tenant, community, site);
      })
    );
  }),
});
