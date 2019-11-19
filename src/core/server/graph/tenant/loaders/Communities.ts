import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/tenant/context";
import {
  Community,
  CommunityConnectionInput,
  retrieveCommunity,
  retrieveCommunityConnection,
  retrieveConsolidatedSettings,
  retrieveManyCommunities,
} from "coral-server/models/community";
import { Settings } from "coral-server/models/settings";

import { createManyBatchLoadFn } from "./util";

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
  connection: ({ first, after, filter }: CommunityConnectionInput) =>
    retrieveCommunityConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter,
    }),
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
