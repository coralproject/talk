import DataLoader from "dataloader";

import TenantContext from "talk-server/graph/tenant/context";
import {
  Asset,
  FindOrCreateAssetInput,
  retrieveManyAssets,
} from "talk-server/models/asset";
import { findOrCreate } from "talk-server/services/assets";

export default (ctx: TenantContext) => ({
  findOrCreate: (input: FindOrCreateAssetInput) =>
    findOrCreate(ctx.mongo, ctx.tenant, input),
  asset: new DataLoader<string, Asset | null>(ids =>
    retrieveManyAssets(ctx.mongo, ctx.tenant.id, ids)
  ),
});
