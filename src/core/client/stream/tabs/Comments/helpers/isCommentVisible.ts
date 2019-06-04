import { COMMENT_STATUS } from "coral-stream/__generated__/CreateCommentMutation.graphql";

const VisibleStatus = ["APPROVED", "NONE"];

export default function isCommentVisible(comment: {
  status: COMMENT_STATUS;
}): boolean {
  return VisibleStatus.includes(comment.status);
}
