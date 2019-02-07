import { MutationResponse } from "talk-framework/lib/relay";
import { CreateCommentMutation } from "talk-stream/__generated__/CreateCommentMutation.graphql";
import { CreateCommentReplyMutation } from "talk-stream/__generated__/CreateCommentReplyMutation.graphql";
import { isInReview, isRejected } from "talk-stream/helpers";

export type SubmitStatus = "APPROVED" | "RETRY" | "IN_REVIEW" | "REJECTED";

export default function getSubmitStatus(
  response:
    | MutationResponse<CreateCommentMutation, "createComment">
    | MutationResponse<CreateCommentReplyMutation, "createCommentReply">
): SubmitStatus {
  if (isInReview(response.edge.node.status)) {
    return "IN_REVIEW";
  }
  if (isRejected(response.edge.node.status)) {
    return "REJECTED";
  }
  return "APPROVED";
}
