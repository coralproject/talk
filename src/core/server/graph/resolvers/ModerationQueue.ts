import { defaultTo } from "lodash";

import {
  CommentConnectionInput,
  retrieveCommentConnection,
} from "coral-server/models/comment";
import {
  GQLCOMMENT_SORT,
  GQLModerationQueueTypeResolver,
} from "../schema/__generated__/types";

export interface ModerationQueueInput {
  selector: string;
  connection: Partial<CommentConnectionInput>;
  count: number | null;
}

export const ModerationQueue: GQLModerationQueueTypeResolver<
  ModerationQueueInput
> = {
  id: ({ selector, connection: { filter } }) => {
    // NOTE: (wyattjoh) when the queues change shape in the future, investigate adding more dynamicness to this id generation
    if (filter && filter.storyID) {
      return selector + "::storyID:" + filter.storyID;
    }

    return selector;
  },
  comments: ({ connection }, { first, after }, { mongo, tenant }) => {
    return retrieveCommentConnection(mongo, tenant.id, {
      ...connection,
      first: defaultTo(first, 10),
      after,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
    });
  },
};
