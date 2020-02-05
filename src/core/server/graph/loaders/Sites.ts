import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/context";
import {
  retrieveManySites,
  retrieveSite,
  retrieveSiteConnection,
  Site,
} from "coral-server/models/site";

import { QueryToSitesArgs } from "coral-server/graph/schema/__generated__/types";

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
  connection: ({ first, after }: QueryToSitesArgs) =>
    retrieveSiteConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 20),
      after,
    }),
});
