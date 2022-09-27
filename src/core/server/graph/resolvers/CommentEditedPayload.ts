import { GQLCommentEditedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentEditedInput } from "./Subscription/commentEdited";

export const CommentEditedPayload: GQLCommentEditedPayloadTypeResolver<CommentEditedInput> =
  {
    comment: ({ commentID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, commentID),
  };
