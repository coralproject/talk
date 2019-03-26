import { defaultsDeep } from "lodash";

import {
  GQLSTORY_STATUS,
  GQLStoryTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action/comment";
import * as story from "talk-server/models/story";
import { getStoryClosedAt } from "talk-server/services/stories";

import TenantContext from "../context";
import { storyModerationInputResolver } from "./ModerationQueues";

const isStoryClosed = (s: story.Story, ctx: TenantContext) => {
  const closedAt = getStoryClosedAt(ctx.tenant, s) || null;
  return !!closedAt && new Date() >= closedAt;
};

export const Story: GQLStoryTypeResolver<story.Story> = {
  comments: (s, input, ctx) => ctx.loaders.Comments.forStory(s.id, input),
  status: (s, input, ctx) =>
    isStoryClosed(s, ctx) ? GQLSTORY_STATUS.CLOSED : GQLSTORY_STATUS.OPEN,
  isClosed: (s, input, ctx) => isStoryClosed(s, ctx),
  closedAt: (s, input, ctx) => getStoryClosedAt(ctx.tenant, s) || null,
  commentActionCounts: s => decodeActionCounts(s.commentCounts.action),
  commentCounts: s => s.commentCounts.status,
  // Merge tenant settings into the story settings so we can easily inherit the
  // options if they exist.
  settings: (s, input, ctx) => defaultsDeep({}, s.settings, ctx.tenant),
  moderationQueues: storyModerationInputResolver,
};
