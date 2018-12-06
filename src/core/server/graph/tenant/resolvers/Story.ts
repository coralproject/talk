import { DateTime } from "luxon";

import { GQLStoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action/comment";
import * as story from "talk-server/models/story";
import { ModerationQueuesInput } from "./ModerationQueues";

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
  commentActionCounts: s => decodeActionCounts(s.commentCounts.action),
  commentCounts: s => s.commentCounts.status,
  moderationQueues: (s): ModerationQueuesInput => ({
    connection: {
      filter: {
        // This moderationQueues is being sourced from the Story, so require
        // that all the comments for theses queues are also for this Story.
        storyID: s.id,
      },
    },
    counts: s.commentCounts.moderationQueue.queues,
  }),
};
