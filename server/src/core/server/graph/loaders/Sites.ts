import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/context";
import {
  retrieveManySites,
  retrieveSiteConnection,
  Site,
  SiteConnectionInput,
} from "coral-server/models/site";

import { QueryToSitesArgs } from "coral-server/graph/schema/__generated__/types";

const queryFilter = (query?: string): SiteConnectionInput["filter"] => {
  if (query) {
    return { $text: { $search: query } };
  }

  return {};
};

export default (ctx: TenantContext) => ({
  site: new DataLoader<string, Site | null>(
    (ids) => retrieveManySites(ctx.mongo, ctx.tenant.id, ids),
    {
      cache: !ctx.disableCaching,
    }
  ),
  connection: ({ first, after, query }: QueryToSitesArgs) =>
    retrieveSiteConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 20),
      after,
      filter: {
        // Merge the query filters into the query.
        ...queryFilter(query),
      },
    }),
});
