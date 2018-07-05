import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import {
  Comment,
  CommentStatus,
  createComment,
  CreateCommentInput,
} from "talk-server/models/comment";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "action_counts"
>;

export async function create(
  db: Db,
  tenantID: string,
  input: CreateComment
): Promise<Comment> {
  // TODO: run the comment through the moderation phases.
  const comment = await createComment(db, tenantID, {
    status: CommentStatus.ACCEPTED,
    action_counts: {},
    ...input,
  });

  return comment;
}
