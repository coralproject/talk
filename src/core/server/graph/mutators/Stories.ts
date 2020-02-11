import { isNull, omitBy } from "lodash";

import { ERROR_CODES } from "coral-common/errors";
import GraphContext from "coral-server/graph/context";
import { mapFieldsetToErrorCodes } from "coral-server/graph/errors";
import { Story } from "coral-server/models/story";
import {
  close,
  create,
  merge,
  open,
  remove,
  update,
  updateSettings,
} from "coral-server/services/stories";
import { scrape } from "coral-server/services/stories/scraper";

import {
  GQLCloseStoryInput,
  GQLCreateStoryInput,
  GQLMergeStoriesInput,
  GQLOpenStoryInput,
  GQLRemoveStoryInput,
  GQLScrapeStoryInput,
  GQLUpdateStoryInput,
  GQLUpdateStorySettingsInput,
} from "coral-server/graph/schema/__generated__/types";

export const Stories = (ctx: GraphContext) => ({
  create: async (input: GQLCreateStoryInput): Promise<Readonly<Story> | null> =>
    mapFieldsetToErrorCodes(
      create(
        ctx.mongo,
        ctx.tenant,
        ctx.config,
        input.story.id,
        input.story.url,
        {
          ...omitBy(input.story, isNull),
          siteID: input.story.siteID,
        },
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
  ): Promise<Readonly<Story> | null> =>
    updateSettings(ctx.mongo, ctx.tenant, input.id, input.settings, ctx.now),
  close: (input: GQLCloseStoryInput): Promise<Readonly<Story> | null> =>
    close(ctx.mongo, ctx.tenant, input.id, ctx.now),
  open: (input: GQLOpenStoryInput): Promise<Readonly<Story> | null> =>
    open(ctx.mongo, ctx.tenant, input.id, ctx.now),
  merge: async (input: GQLMergeStoriesInput): Promise<Readonly<Story> | null> =>
    merge(
      ctx.mongo,
      ctx.redis,
      ctx.tenant,
      input.destinationID,
      input.sourceIDs
    ),
  remove: async (input: GQLRemoveStoryInput): Promise<Readonly<Story> | null> =>
    remove(ctx.mongo, ctx.tenant, input.id, input.includeComments),
  scrape: async (input: GQLScrapeStoryInput): Promise<Readonly<Story> | null> =>
    scrape(ctx.mongo, ctx.config, ctx.tenant.id, input.id),
});
