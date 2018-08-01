import TenantContext from "talk-server/graph/tenant/context";
import { CreateCommentInput } from "talk-server/graph/tenant/resolvers/mutation";
import { Comment } from "talk-server/models/comment";
import { create } from "talk-server/services/comments";

export default (ctx: TenantContext) => ({
  create: (input: CreateCommentInput): Promise<Comment> => {
    // FIXME: remove tenant + user !
    return create(ctx.db, ctx.tenant!.id, {
      author_id: ctx.user!.id,
      asset_id: input.assetID,
      body: input.body,
      parent_id: input.parentID,
    });
  },
});
