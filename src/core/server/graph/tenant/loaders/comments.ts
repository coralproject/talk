import DataLoader from "dataloader";
import Context from "talk-server/graph/tenant/context";
import {
  Comment,
  ConnectionInput,
  retrieveAssetConnection,
  retrieveMany,
  retrieveRepliesConnection,
} from "talk-server/models/comment";

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveMany(ctx.db, ctx.tenant.id, ids)
  ),
  forAsset: (assetID: string, input: ConnectionInput) =>
    retrieveAssetConnection(ctx.db, ctx.tenant.id, assetID, input),
  forParent: (assetID: string, parentID: string, input: ConnectionInput) =>
    retrieveRepliesConnection(ctx.db, ctx.tenant.id, assetID, parentID, input),
});
