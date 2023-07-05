import { GQLCommentCreatedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentCreatedInput } from "./Subscription/commentCreated";

export const CommentCreatedPayload: GQLCommentCreatedPayloadTypeResolver<CommentCreatedInput> =
  {
    comment: ({ commentID, storyID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, storyID, commentID),
  };
