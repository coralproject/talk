import { GQLCommentReplyCreatedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentReplyCreatedInput } from "./Subscription/commentReplyCreated";

export const CommentReplyCreatedPayload: GQLCommentReplyCreatedPayloadTypeResolver<CommentReplyCreatedInput> =
  {
    comment: ({ commentID, storyID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, storyID, commentID),
  };
