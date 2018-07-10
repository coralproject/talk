import DataLoader from "dataloader";
import TenantContext from "talk-server/graph/tenant/context";
import {
  Asset,
  findOrCreateAsset,
  FindOrCreateAssetInput,
  retrieveManyAssets,
} from "talk-server/models/asset";

export default (ctx: TenantContext) => ({
  findOrCreate: (input: FindOrCreateAssetInput) =>
    findOrCreateAsset(ctx.db, ctx.tenant.id, input),
  asset: new DataLoader<string, Asset | null>(ids =>
    retrieveManyAssets(ctx.db, ctx.tenant.id, ids)
  ),
});
