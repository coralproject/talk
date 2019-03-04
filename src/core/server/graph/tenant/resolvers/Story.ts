import { GQLStoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action/comment";
import * as story from "talk-server/models/story";
import { getStoryClosedAt } from "talk-server/services/stories";

import { storyModerationInputResolver } from "./ModerationQueues";

export const Story: GQLStoryTypeResolver<story.Story> = {
  comments: (s, input, ctx) => ctx.loaders.Comments.forStory(s.id, input),
  isClosed: (s, input, ctx) => {
    const closedAt = getStoryClosedAt(ctx.tenant, s);
    return !!closedAt && new Date() >= closedAt;
  },
  closedAt: (s, input, ctx) => getStoryClosedAt(ctx.tenant, s),
  commentActionCounts: s => decodeActionCounts(s.commentCounts.action),
  commentCounts: s => s.commentCounts.status,
  moderationQueues: storyModerationInputResolver,
};
