import { isNull, omitBy } from "lodash";

import { ERROR_CODES } from "coral-common/errors";
import GraphContext from "coral-server/graph/context";
import { mapFieldsetToErrorCodes } from "coral-server/graph/errors";
import {
  archiveStory,
  markStoryForArchiving,
  retrieveStory,
  Story,
  unarchiveStory,
} from "coral-server/models/story";
import { hasFeatureFlag } from "coral-server/models/tenant";
import {
  addExpert,
  close,
  create,
  merge,
  open,
  remove,
  removeExpert,
  update,
  updateSettings,
  updateStoryMode,
} from "coral-server/services/stories";
import { scrape } from "coral-server/services/stories/scraper";

import {
  GQLAddStoryExpertInput,
  GQLArchiveStoryInput,
  GQLCloseStoryInput,
  GQLCreateStoryInput,
  GQLFEATURE_FLAG,
  GQLMergeStoriesInput,
  GQLOpenStoryInput,
  GQLRemoveStoryExpertInput,
  GQLRemoveStoryInput,
  GQLScrapeStoryInput,
  GQLUnarchiveStoryInput,
  GQLUpdateStoryInput,
  GQLUpdateStoryModeInput,
  GQLUpdateStorySettingsInput,
} from "coral-server/graph/schema/__generated__/types";

import { validateUserModerationScopes } from "./helpers";

export const Stories = (ctx: GraphContext) => ({
  create: async (input: GQLCreateStoryInput): Promise<Readonly<Story> | null> =>
    mapFieldsetToErrorCodes(
      create(
        ctx.mongo,
        ctx.tenant,
        ctx.broker,
        ctx.config,
        input.story.id,
        input.story.url,
        omitBy(input.story, isNull),
        ctx.now
      ),
      {
        "input.story.url": [
          ERROR_CODES.STORY_URL_NOT_PERMITTED,
          ERROR_CODES.DUPLICATE_STORY_URL,
        ],
      }
    ),
  update: async (input: GQLUpdateStoryInput): Promise<Readonly<Story> | null> =>
    mapFieldsetToErrorCodes(
      update(ctx.mongo, ctx.tenant, input.id, input.story, ctx.now),
      {
        "input.story.url": [
          ERROR_CODES.STORY_URL_NOT_PERMITTED,
          ERROR_CODES.DUPLICATE_STORY_URL,
        ],
      }
    ),
  updateSettings: async (
    input: GQLUpdateStorySettingsInput
  ): Promise<Readonly<Story> | null> => {
    // Validate that this user is allowed to edit this story if the feature
    // flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, { storyID: input.id });
    }

    return updateSettings(
      ctx.mongo,
      ctx.tenant,
      input.id,
      input.settings,
      ctx.now
    );
  },
  close: async (input: GQLCloseStoryInput): Promise<Readonly<Story> | null> => {
    // Validate that this user is allowed to close this story if the feature
    // flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, { storyID: input.id });
    }

    return close(ctx.mongo, ctx.tenant, input.id, ctx.now);
  },
  open: async (input: GQLOpenStoryInput): Promise<Readonly<Story> | null> => {
    // Validate that this user is allowed to open this story if the feature
    // flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, { storyID: input.id });
    }

    return open(ctx.mongo, ctx.tenant, input.id, ctx.now);
  },
  merge: async (input: GQLMergeStoriesInput): Promise<Readonly<Story> | null> =>
    merge(ctx.mongo, ctx.tenant, input.destinationID, input.sourceIDs),
  remove: async (input: GQLRemoveStoryInput): Promise<Readonly<Story> | null> =>
    remove(ctx.mongo, ctx.tenant, input.id, input.includeComments),
  scrape: async (input: GQLScrapeStoryInput): Promise<Readonly<Story> | null> =>
    scrape(ctx.mongo, ctx.config, ctx.tenant.id, input.id),
  updateStoryMode: async (input: GQLUpdateStoryModeInput) => {
    // Validate that this user is allowed to update the story mode if the
    // feature flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, {
        storyID: input.storyID,
      });
    }

    return updateStoryMode(ctx.mongo, ctx.tenant, input.storyID, input.mode);
  },
  addStoryExpert: async (input: GQLAddStoryExpertInput) => {
    // Validate that this user is allowed to add a story expert if the
    // feature flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, {
        storyID: input.storyID,
      });
    }

    return addExpert(ctx.mongo, ctx.tenant, input.storyID, input.userID);
  },
  removeStoryExpert: async (input: GQLRemoveStoryExpertInput) => {
    // Validate that this user is allowed to remove a story expert if the
    // feature flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, {
        storyID: input.storyID,
      });
    }

    return removeExpert(ctx.mongo, ctx.tenant, input.storyID, input.userID);
  },
  archiveStory: async (input: GQLArchiveStoryInput) => {
    const markResult = await markStoryForArchiving(
      ctx.mongo,
      ctx.tenant.id,
      input.storyID,
      ctx.now
    );

    if (markResult?.isArchiving) {
      await archiveStory(ctx.mongo, ctx.archive, ctx.tenant.id, input.storyID);
    }

    return retrieveStory(ctx.mongo, ctx.tenant.id, input.storyID);
  },
  unarchiveStory: async (input: GQLUnarchiveStoryInput) => {
    const markResult = await markStoryForArchiving(
      ctx.mongo,
      ctx.tenant.id,
      input.storyID,
      ctx.now
    );

    if (markResult?.isArchiving) {
      await unarchiveStory(
        ctx.mongo,
        ctx.archive,
        ctx.tenant.id,
        input.storyID
      );
    }

    return retrieveStory(ctx.mongo, ctx.tenant.id, input.storyID);
  },
});
