import DataLoader from "dataloader";
import {
  Asset,
  retrieveMany as retrieveManyAssets,
} from "talk-server/models/asset";
import Context from "talk-server/graph/tenant/context";

export default (ctx: Context) => ({
  asset: new DataLoader<string, Asset>(ids =>
    retrieveManyAssets(ctx.db, ctx.tenant.id, ids)
  ),
});
