import {
  GQLCOMMENT_STATUS,
  GQLCommentCountsTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { CommentStatusCounts } from "talk-server/models/story";

const CommentCounts: GQLCommentCountsTypeResolver<CommentStatusCounts> = {
  totalVisible: commentCounts =>
    commentCounts[GQLCOMMENT_STATUS.ACCEPTED] +
    commentCounts[GQLCOMMENT_STATUS.NONE],
  statuses: commentCounts => commentCounts,
};

export default CommentCounts;
