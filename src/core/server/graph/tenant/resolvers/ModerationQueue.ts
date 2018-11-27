import {
  CommentConnectionInput,
  retrieveCommentConnection,
} from "talk-server/models/comment";
import {
  GQLCOMMENT_SORT,
  GQLModerationQueueTypeResolver,
} from "../schema/__generated__/types";

export interface ModerationQueueInput {
  connection: Partial<CommentConnectionInput>;
  count: number;
}

export const ModerationQueue: GQLModerationQueueTypeResolver<
  ModerationQueueInput
> = {
  comments: ({ connection }, { first = 10, after }, { mongo, tenant }) =>
    retrieveCommentConnection(mongo, tenant.id, {
      ...connection,
      first,
      after,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
    }),
};
