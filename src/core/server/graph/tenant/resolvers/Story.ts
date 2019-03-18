import { defaultsDeep } from "lodash";

import { GQLStoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action/comment";
import * as story from "talk-server/models/story";
import { getStoryClosedAt } from "talk-server/services/stories";

import { storyModerationInputResolver } from "./ModerationQueues";

export const Story: GQLStoryTypeResolver<story.Story> = {
  comments: (s, input, ctx) => ctx.loaders.Comments.forStory(s.id, input),
  isClosed: (s, input, ctx) => {
    const closedAt = getStoryClosedAt(ctx.tenant, s) || null;
    return !!closedAt && new Date() >= closedAt;
  },
  closedAt: (s, input, ctx) => getStoryClosedAt(ctx.tenant, s) || null,
  commentActionCounts: s => decodeActionCounts(s.commentCounts.action),
  commentCounts: s => s.commentCounts.status,
  // Merge tenant settings into the story settings so we can easily inherit the
  // options if they exist.
  settings: (s, input, ctx) => defaultsDeep({}, s.settings, ctx.tenant),
  moderationQueues: storyModerationInputResolver,
};
