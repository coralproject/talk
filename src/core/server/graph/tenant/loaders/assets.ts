import DataLoader from "dataloader";
import TenantContext from "talk-server/graph/tenant/context";
import { Asset, retrieveManyAssets } from "talk-server/models/asset";

export default (ctx: TenantContext) => ({
  asset: new DataLoader<string, Asset | null>(ids =>
    retrieveManyAssets(ctx.db, ctx.tenant.id, ids)
  ),
});
