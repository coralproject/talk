import { GQLCommentEnteredPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentEnteredInput } from "./Subscription/commentEntered";

export const CommentEnteredPayload: GQLCommentEnteredPayloadTypeResolver<CommentEnteredInput> =
  {
    comment: ({ commentID, storyID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, storyID, commentID),
  };
