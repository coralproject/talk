import DataLoader from "dataloader";

import Context from "talk-server/graph/tenant/context";
import {
  AssetToCommentsArgs,
  CommentToRepliesArgs,
  GQLCOMMENT_SORT,
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
  forAsset: (
    assetID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: AssetToCommentsArgs
  ) =>
    retrieveCommentAssetConnection(ctx.db, ctx.tenant.id, assetID, {
      first,
      orderBy,
      after,
    }),
  forParent: (
    assetID: string,
    parentID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: CommentToRepliesArgs
  ) =>
    retrieveCommentRepliesConnection(ctx.db, ctx.tenant.id, assetID, parentID, {
      first,
      orderBy,
      after,
    }),
});
