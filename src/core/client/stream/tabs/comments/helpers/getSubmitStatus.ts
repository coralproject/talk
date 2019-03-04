import { MutationResponse } from "talk-framework/lib/relay";
import { CreateCommentMutation } from "talk-stream/__generated__/CreateCommentMutation.graphql";
import { CreateCommentReplyMutation } from "talk-stream/__generated__/CreateCommentReplyMutation.graphql";
import { EditCommentMutation } from "talk-stream/__generated__/EditCommentMutation.graphql";
import { isInReview, isRejected } from "talk-stream/helpers";

export type SubmitStatus = "APPROVED" | "RETRY" | "IN_REVIEW" | "REJECTED";

export default function getSubmitStatus(
  response:
    | MutationResponse<CreateCommentMutation, "createComment">
    | MutationResponse<CreateCommentReplyMutation, "createCommentReply">
    | MutationResponse<EditCommentMutation, "editComment">
): SubmitStatus {
  const node = "edge" in response ? response.edge.node : response.comment;
  if (isInReview(node.status)) {
    return "IN_REVIEW";
  }
  if (isRejected(node.status)) {
    return "REJECTED";
  }
  return "APPROVED";
}
