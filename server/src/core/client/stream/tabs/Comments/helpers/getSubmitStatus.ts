import { MutationResponse } from "coral-framework/lib/relay";

import { CreateCommentMutation } from "coral-stream/__generated__/CreateCommentMutation.graphql";
import { CreateCommentReplyMutation } from "coral-stream/__generated__/CreateCommentReplyMutation.graphql";
import { EditCommentMutation } from "coral-stream/__generated__/EditCommentMutation.graphql";

import isInReview from "./isInReview";
import isRejected from "./isRejected";

export type SubmitStatus = "APPROVED" | "RETRY" | "IN_REVIEW" | "REJECTED";

interface SubmissionResponse {
  status: SubmitStatus;
  commentID: string;
}

export function getSubmissionResponse(
  response:
    | Omit<
        MutationResponse<CreateCommentMutation, "createComment">,
        "clientMutationId"
      >
    | Omit<
        MutationResponse<CreateCommentReplyMutation, "createCommentReply">,
        "clientMutationId"
      >
    | Omit<
        MutationResponse<EditCommentMutation, "editComment">,
        "clientMutationId"
      >
): SubmissionResponse {
  const node = "edge" in response ? response.edge.node : response.comment;
  const commentID = node.id;

  if (isInReview(node.status)) {
    return { status: "IN_REVIEW", commentID };
  }
  if (isRejected(node.status)) {
    return { status: "REJECTED", commentID };
  }
  return { status: "APPROVED", commentID };
}

export default function getSubmitStatus(
  response:
    | Omit<
        MutationResponse<CreateCommentMutation, "createComment">,
        "clientMutationId"
      >
    | Omit<
        MutationResponse<CreateCommentReplyMutation, "createCommentReply">,
        "clientMutationId"
      >
    | Omit<
        MutationResponse<EditCommentMutation, "editComment">,
        "clientMutationId"
      >
): SubmitStatus {
  const r = getSubmissionResponse(response);
  return r.status;
}
