import { defaultTo } from "lodash";

import Context from "coral-server/graph/context";
import {
  ACTION_TYPE,
  CommentActionConnectionInput,
  retrieveCommentActionConnection,
} from "coral-server/models/action/comment";
import { Cursor } from "coral-server/models/helpers";

import {
  GQLCOMMENT_FLAG_REPORTED_REASON,
  GQLCOMMENT_SORT,
} from "../schema/__generated__/types";

interface FilteredConnectionInput {
  first?: number;
  after?: Cursor;
  storyID?: string;
  orderBy: GQLCOMMENT_SORT;
  filter: {
    actionType?: ACTION_TYPE;
    reason: {
      $in: GQLCOMMENT_FLAG_REPORTED_REASON[];
    };
  };
}

export default (ctx: Context) => ({
  connection: ({
    first,
    after,
    orderBy,
    filter,
  }: CommentActionConnectionInput) =>
    retrieveCommentActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter,
      orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
    }),
  forFilter: ({
    first,
    after,
    storyID,
    orderBy,
    filter,
  }: FilteredConnectionInput) => {
    const appliedFilter = storyID ? { storyID, ...filter } : filter;

    return retrieveCommentActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter: appliedFilter,
      orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
    });
  },
});
