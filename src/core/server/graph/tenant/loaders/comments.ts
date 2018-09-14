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
  retrieveCommentUserConnection,
  retrieveManyComments,
} from "talk-server/models/comment";

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveManyComments(ctx.mongo, ctx.tenant.id, ids)
  ),
  forUser: (
    userID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: AssetToCommentsArgs
  ) =>
    retrieveCommentUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first,
      orderBy,
      after,
    }),
  forAsset: (
    assetID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: AssetToCommentsArgs
  ) =>
    retrieveCommentAssetConnection(ctx.mongo, ctx.tenant.id, assetID, {
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
    retrieveCommentRepliesConnection(
      ctx.mongo,
      ctx.tenant.id,
      assetID,
      parentID,
      {
        first,
        orderBy,
        after,
      }
    ),
});
