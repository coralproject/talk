import { isNull, omitBy } from "lodash";

import { ERROR_CODES } from "talk-common/errors";
import { mapFieldsetToErrorCodes } from "talk-server/graph/common/errors";
import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCloseStoryInput,
  GQLCreateStoryInput,
  GQLMergeStoriesInput,
  GQLOpenStoryInput,
  GQLRemoveStoryInput,
  GQLScrapeStoryInput,
  GQLUpdateStoryInput,
  GQLUpdateStorySettingsInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Story } from "talk-server/models/story";
import {
  close,
  create,
  merge,
  open,
  remove,
  update,
  updateSettings,
} from "talk-server/services/stories";
import { scrape } from "talk-server/services/stories/scraper";

export const Stories = (ctx: TenantContext) => ({
  create: async (input: GQLCreateStoryInput): Promise<Readonly<Story> | null> =>
    mapFieldsetToErrorCodes(
      create(
        ctx.mongo,
        ctx.tenant,
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
    scrape(ctx.mongo, ctx.tenant.id, input.id),
});
