import TenantContext from "talk-server/graph/tenant/context";
import { GQLCreateCommentInput } from "talk-server/graph/tenant/schema/__generated__/types";
import { Comment } from "talk-server/models/comment";
import { create } from "talk-server/services/comments";

export default (ctx: TenantContext) => ({
  create: (input: GQLCreateCommentInput): Promise<Comment> => {
    // FIXME: remove user!
    return create(ctx.mongo, ctx.tenant, {
      author_id: ctx.user!.id,
      asset_id: input.assetID,
      body: input.body,
      parent_id: input.parentID,
    });
  },
});
