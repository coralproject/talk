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
  GQLSectionFilter,
} from "../schema/__generated__/types";

import { requiredPropertyFilter, sectionFilter } from "./helpers";

interface FilteredConnectionInput {
  first?: number;
  after?: Cursor;
  storyID?: string;
  siteID?: string;
  section?: GQLSectionFilter;
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
    siteID,
    orderBy,
    section,
    filter,
  }: FilteredConnectionInput) => {
    return retrieveCommentActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter: {
        ...filter,
        ...sectionFilter(ctx.tenant, section),
        // If these properties are not provided or are null, remove them from
        // the filter because they do not exist in a nullable state on the
        // database model.
        ...requiredPropertyFilter({ storyID, siteID }),
      },
      orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
    });
  },
});
