import DataLoader from "dataloader";

import TenantContext from "coral-server/graph/tenant/context";
import { retrieveCommunity } from "coral-server/models/community";

import { createManyBatchLoadFn } from "./util";
// import {
// } from "coral-server/graph/tenant/schema/__generated__/types";

export default (ctx: TenantContext) => ({
  find: new DataLoader(
    createManyBatchLoadFn((id: string) =>
      retrieveCommunity(ctx.mongo, ctx.tenant.id, id)
    )
  ),
});
