import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/context";
import {
  retrieveManySites,
  retrieveSiteConnection,
  Site,
} from "coral-server/models/site";

import { QueryToSitesArgs } from "coral-server/graph/schema/__generated__/types";

export default (ctx: TenantContext) => ({
  site: new DataLoader<string, Site | null>(
    (ids) => retrieveManySites(ctx.mongo.live, ctx.tenant.id, ids),
    {
      cache: !ctx.disableCaching,
    }
  ),
  connection: ({ first, after }: QueryToSitesArgs) =>
    retrieveSiteConnection(ctx.mongo.live, ctx.tenant.id, {
      first: defaultTo(first, 20),
      after,
    }),
});
