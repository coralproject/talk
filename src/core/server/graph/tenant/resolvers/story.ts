import { DateTime } from "luxon";

import { GQLStoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action";
import { Story } from "talk-server/models/story";

const Story: GQLStoryTypeResolver<Story> = {
  comments: (story, input, ctx) =>
    ctx.loaders.Comments.forStory(story.id, input),
  isClosed: () => false,
  closedAt: (story, input, ctx) => {
    if (story.closedAt) {
      return story.closedAt;
    }

    if (ctx.tenant.autoCloseStream && ctx.tenant.closedTimeout) {
      return DateTime.fromJSDate(story.created_at)
        .plus(ctx.tenant.closedTimeout)
        .toJSDate();
    }

    return null;
  },
  actionCounts: story => decodeActionCounts(story.action_counts),
  commentCounts: story => story.comment_counts,
};

export default Story;
