import DataLoader from "dataloader";

import TenantContext from "coral-server/graph/tenant/context";
import { retrieveCommunitySites, retrieveSite } from "coral-server/models/site";

import { createManyBatchLoadFn } from "./util";

export default (ctx: TenantContext) => ({
  find: new DataLoader(
    createManyBatchLoadFn((id: string) =>
      retrieveSite(ctx.mongo, ctx.tenant.id, id)
    )
  ),
  // how to use dataloader
  forCommunity: (communityID: string) =>
    retrieveCommunitySites(ctx.mongo, ctx.tenant.id, communityID),
});
