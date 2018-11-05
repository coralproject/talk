import { DateTime } from "luxon";

import { GQLStoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action";
import * as story from "talk-server/models/story";

export const Story: GQLStoryTypeResolver<story.Story> = {
  comments: (s, input, ctx) => ctx.loaders.Comments.forStory(s.id, input),
  isClosed: () => false,
  closedAt: (s, input, ctx) => {
    if (s.closedAt) {
      return s.closedAt;
    }

    if (ctx.tenant.autoCloseStream && ctx.tenant.closedTimeout) {
      return DateTime.fromJSDate(s.createdAt)
        .plus(ctx.tenant.closedTimeout)
        .toJSDate();
    }

    return null;
  },
  actionCounts: s => decodeActionCounts(s.actionCounts),
  commentCounts: s => s.commentCounts,
};
