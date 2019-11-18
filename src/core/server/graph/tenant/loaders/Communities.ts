import DataLoader from "dataloader";

import TenantContext from "coral-server/graph/tenant/context";
import {
  Community,
  retrieveCommunity,
  retrieveConsolidatedSettings,
  retrieveManyCommunities,
} from "coral-server/models/community";
import { Settings } from "coral-server/models/settings";

import { createManyBatchLoadFn } from "./util";

// import {
// } from "coral-server/graph/tenant/schema/__generated__/types";

export default (ctx: TenantContext) => ({
  find: new DataLoader(
    createManyBatchLoadFn((id: string) =>
      retrieveCommunity(ctx.mongo, ctx.tenant.id, id)
    )
  ),
  community: new DataLoader<string, Community | null>(
    ids => retrieveManyCommunities(ctx.mongo, ctx.tenant.id, ids),
    {
      cache: !ctx.disableCaching,
    }
  ),
  settings: new DataLoader<string, Settings | null>(async ids => {
    const communities = await retrieveManyCommunities(
      ctx.mongo,
      ctx.tenant.id,
      ids
    );
    return communities.map(community => {
      return retrieveConsolidatedSettings(ctx.tenant, community);
    });
  }),
});
