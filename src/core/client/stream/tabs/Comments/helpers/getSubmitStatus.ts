import { MutationResponse } from "coral-framework/lib/relay";

import { CreateCommentMutation } from "coral-stream/__generated__/CreateCommentMutation.graphql";
import { CreateCommentReplyMutation } from "coral-stream/__generated__/CreateCommentReplyMutation.graphql";
import { EditCommentMutation } from "coral-stream/__generated__/EditCommentMutation.graphql";

import isInReview from "./isInReview";
import isRejected from "./isRejected";

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
