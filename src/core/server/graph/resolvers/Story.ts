import { defaultsDeep } from "lodash";

import {
  GQLSTORY_STATUS,
  GQLStoryTypeResolver,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";
import { decodeActionCounts } from "coral-server/models/action/comment";
import * as story from "coral-server/models/story";

import GraphContext from "../context";
import { CommentCountsInput } from "./CommentCounts";
import { storyModerationInputResolver } from "./ModerationQueues";

const isStoryClosed = (s: story.Story, ctx: GraphContext) => {
  const closedAt = story.getStoryClosedAt(ctx.tenant, s) || null;
  return !!closedAt && new Date() >= closedAt;
};

export const Story: GQLStoryTypeResolver<story.Story> = {
  comments: (s, input, ctx) => ctx.loaders.Comments.forStory(s.id, input),
  featuredComments: (s, input, ctx) =>
    ctx.loaders.Comments.taggedForStory(s.id, GQLTAG.FEATURED, input),
  status: (s, input, ctx) =>
    isStoryClosed(s, ctx) ? GQLSTORY_STATUS.CLOSED : GQLSTORY_STATUS.OPEN,
  isClosed: (s, input, ctx) => isStoryClosed(s, ctx),
  closedAt: (s, input, ctx) => story.getStoryClosedAt(ctx.tenant, s) || null,
  commentActionCounts: s => decodeActionCounts(s.commentCounts.action),
  commentCounts: (s): CommentCountsInput => s,
  // Merge tenant settings into the story settings so we can easily inherit the
  // options if they exist.
  settings: (s, input, ctx) => defaultsDeep({}, s.settings, ctx.tenant),
  moderationQueues: storyModerationInputResolver,
  site: (s, input, ctx) => ctx.loaders.Sites.site.load(s.siteID),
};
