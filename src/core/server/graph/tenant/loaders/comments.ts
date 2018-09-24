import DataLoader from "dataloader";

import Context from "talk-server/graph/tenant/context";
import {
  AssetToCommentsArgs,
  CommentToRepliesArgs,
  GQLActionPresence,
  GQLCOMMENT_SORT,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_ITEM_TYPE,
  retrieveManyUserActionPresence,
} from "talk-server/models/action";
import {
  retrieveCommentAssetConnection,
  retrieveCommentRepliesConnection,
  retrieveManyComments,
} from "talk-server/models/comment";

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveManyComments(ctx.mongo, ctx.tenant.id, ids)
  ),
  retrieveMyActionPresence: new DataLoader<string, GQLActionPresence>(
    (itemIDs: string[]) =>
      retrieveManyUserActionPresence(
        ctx.mongo,
        ctx.tenant.id,
        // This should only ever be accessed when a user is logged in.
        ctx.user!.id,
        ACTION_ITEM_TYPE.COMMENTS,
        itemIDs
      )
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
