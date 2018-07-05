import DataLoader from "dataloader";

import Context from "talk-server/graph/tenant/context";
import {
  AssetToCommentsArgs,
  CommentToRepliesArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  retrieveCommentAssetConnection,
  retrieveCommentRepliesConnection,
  retrieveManyComments,
} from "talk-server/models/comment";

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveManyComments(ctx.db, ctx.tenant.id, ids)
  ),
  forAsset: (assetID: string, input: AssetToCommentsArgs) =>
    retrieveCommentAssetConnection(ctx.db, ctx.tenant.id, assetID, input),
  forParent: (assetID: string, parentID: string, input: CommentToRepliesArgs) =>
    retrieveCommentRepliesConnection(
      ctx.db,
      ctx.tenant.id,
      assetID,
      parentID,
      input
    ),
});
