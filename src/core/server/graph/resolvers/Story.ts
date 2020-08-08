import { defaultsDeep } from "lodash";

import { decodeActionCounts } from "coral-server/models/action/comment";
import * as story from "coral-server/models/story";
import { countStoryViewers } from "coral-server/models/story/viewers";
import { hasFeatureFlag } from "coral-server/models/tenant";
import {
  canModerate,
  hasModeratorRole,
} from "coral-server/models/user/helpers";
import { isStoryLiveEnabled } from "coral-server/services/stories";

import {
  GQLFEATURE_FLAG,
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

    // If the feature flag for site moderators is not turned on return based on
    // the users role.
    if (!hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      return hasModeratorRole(ctx.user);
    }

    // We know the user is provided because this edge is authenticated.
    return canModerate(ctx.user, { siteID: s.siteID });
  },
  isClosed: (s, input, ctx) => story.isStoryClosed(ctx.tenant, s, ctx.now),
  closedAt: (s, input, ctx) => story.getStoryClosedAt(ctx.tenant, s) || null,
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
  viewerCount: async (s, input, ctx) => {
    // If the feature flag isn't enabled, then we have nothing to return.
    if (!hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.VIEWER_COUNT)) {
      return null;
    }

    // Check to see if this story has live enabled.
    const liveEnabled = isStoryLiveEnabled(ctx.config, ctx.tenant, s, ctx.now);
    if (!liveEnabled) {
      return null;
    }

    // Return the computed count!
    return countStoryViewers(
      ctx.redis,
      {
        tenantID: ctx.tenant.id,
        siteID: s.siteID,
        storyID: s.id,
      },
      ctx.config.get("story_viewer_timeout")
    );
  },
};
