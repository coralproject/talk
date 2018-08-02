import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { createComment, CreateCommentInput } from "talk-server/models/comment";
import { Tenant } from "talk-server/models/tenant";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "action_counts"
>;

export async function create(db: Db, tenant: Tenant, input: CreateComment) {
  // TODO: run the comment through the moderation phases.
  const comment = await createComment(db, tenant.id, {
    status: GQLCOMMENT_STATUS.ACCEPTED,
    action_counts: {},
    ...input,
  });

  return comment;
}
