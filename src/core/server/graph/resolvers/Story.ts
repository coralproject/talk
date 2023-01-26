import { defaultsDeep } from "lodash";

import { decodeActionCounts } from "coral-server/models/action/comment";
import * as story from "coral-server/models/story";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { canModerate } from "coral-server/models/user/helpers";
import { isLiveEnabled } from "coral-server/services/stories";

import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLSTORY_STATUS,
  GQLStoryTypeResolver,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { CommentCountsInput } from "./CommentCounts";
import { storyModerationInputResolver } from "./ModerationQueues";
import { StorySettingsInput } from "./StorySettings";

export const Story: GQLStoryTypeResolver<story.Story> = {
  comments: (s, input, ctx) => ctx.loaders.Comments.forStory(s.id, input),
  featuredComments: (s, input, ctx) =>
    ctx.loaders.Comments.taggedForStory(s.id, GQLTAG.FEATURED, input),
  status: (s, input, ctx) =>
    story.isStoryClosed(ctx.tenant, s, ctx.now)
      ? GQLSTORY_STATUS.CLOSED
      : GQLSTORY_STATUS.OPEN,
  canModerate: (s, input, ctx) => {
    if (!ctx.user) {
      return false;
    }

    // We know the user is provided because this edge is authenticated.
    return canModerate(ctx.user, { siteID: s.siteID });
  },
  isClosed: (s, input, ctx) => story.isStoryClosed(ctx.tenant, s, ctx.now),
  closedAt: (s, input, ctx) => story.getStoryClosedAt(ctx.tenant, s) || null,
  isArchiving: (s, input, ctx) => story.isStoryArchiving(s),
  isArchived: (s, input, ctx) => story.isStoryArchived(s),
  isUnarchiving: (s, input, ctx) => story.isStoryUnarchiving(s),
  commentActionCounts: (s) => decodeActionCounts(s.commentCounts.action),
  commentCounts: (s): CommentCountsInput => s,
  // Merge tenant settings into the story settings so we can easily inherit the
  // options if they exist.
  settings: (s, input, ctx): StorySettingsInput =>
    defaultsDeep(
      // Pass these options as required by StorySettingsInput.
      { story: s },
      s.settings,
      ctx.tenant
    ),
  moderationQueues: storyModerationInputResolver,
  site: (s, input, ctx) => ctx.loaders.Sites.site.load(s.siteID),
  viewerRating: (s, input, ctx) => {
    if (
      !hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.ENABLE_RATINGS_AND_REVIEWS)
    ) {
      return null;
    }

    if (s.settings.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
      return null;
    }

    return ctx.loaders.Stories.viewerRating(s.id);
  },
  ratings: (s, input, ctx) => {
    if (
      !hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.ENABLE_RATINGS_AND_REVIEWS)
    ) {
      return null;
    }

    if (s.settings.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
      return null;
    }

    return ctx.loaders.Stories.ratings.load(s.id);
  },
  viewerCount: async (s, input, ctx) => {
    // If the feature flag isn't enabled, then we have nothing to return.
    if (!hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.VIEWER_COUNT)) {
      return null;
    }

    // Check to see if this story has live enabled.
    if (!isLiveEnabled(ctx.config, ctx.tenant, s, ctx.now)) {
      return null;
    }

    // Return the computed count!
    return ctx.loaders.Stories.viewerCount(s.siteID, s.id);
  },
};
