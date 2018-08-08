import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateCommentInput,
  GQLEditCommentInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Comment } from "talk-server/models/comment";
import { create, edit } from "talk-server/services/comments";

export default (ctx: TenantContext) => ({
  create: (input: GQLCreateCommentInput): Promise<Comment | null> =>
    create(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      {
        author_id: ctx.user!.id,
        asset_id: input.assetID,
        body: input.body,
        parent_id: input.parentID,
      },
      ctx.req
    ),
  edit: (input: GQLEditCommentInput): Promise<Comment | null> =>
    edit(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      {
        id: input.commentID,
        asset_id: input.assetID,
        body: input.body,
      },
      ctx.req
    ),
});
