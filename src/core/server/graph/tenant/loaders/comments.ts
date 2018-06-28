import DataLoader from "dataloader";

import Context from "talk-server/graph/tenant/context";
import {
  AssetToCommentsArgs,
  CommentToRepliesArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  retrieveAssetConnection,
  retrieveMany,
  retrieveRepliesConnection,
} from "talk-server/models/comment";

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveMany(ctx.db, ctx.tenant.id, ids)
  ),
  forAsset: (assetID: string, input: AssetToCommentsArgs) =>
    retrieveAssetConnection(ctx.db, ctx.tenant.id, assetID, input),
  forParent: (assetID: string, parentID: string, input: CommentToRepliesArgs) =>
    retrieveRepliesConnection(ctx.db, ctx.tenant.id, assetID, parentID, input),
});
