import { isNull, omitBy } from "lodash";

import { ERROR_CODES } from "talk-common/errors";
import { mapFieldsetToErrorCodes } from "talk-server/graph/common/errors";
import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateStoryInput,
  GQLMergeStoriesInput,
  GQLRemoveStoryInput,
  GQLScrapeStoryInput,
  GQLUpdateStoryInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import * as story from "talk-server/models/story";
import { create, merge, remove, update } from "talk-server/services/stories";
import { scrape } from "talk-server/services/stories/scraper";

export const Story = (ctx: TenantContext) => ({
  create: async (
    input: GQLCreateStoryInput
  ): Promise<Readonly<story.Story> | null> =>
    mapFieldsetToErrorCodes(
      create(
        ctx.mongo,
        ctx.tenant,
        input.story.id,
        input.story.url,
        omitBy(input.story, isNull)
      ),
      {
        "input.story.url": [
          ERROR_CODES.STORY_URL_NOT_PERMITTED,
          ERROR_CODES.DUPLICATE_STORY_URL,
        ],
      }
    ),
  update: async (
    input: GQLUpdateStoryInput
  ): Promise<Readonly<story.Story> | null> =>
    mapFieldsetToErrorCodes(
      update(ctx.mongo, ctx.tenant, input.id, omitBy(input.story, isNull)),
      {
        "input.story.url": [
          ERROR_CODES.STORY_URL_NOT_PERMITTED,
          ERROR_CODES.DUPLICATE_STORY_URL,
        ],
      }
    ),
  merge: async (
    input: GQLMergeStoriesInput
  ): Promise<Readonly<story.Story> | null> =>
    merge(
      ctx.mongo,
      ctx.redis,
      ctx.tenant,
      input.destinationID,
      input.sourceIDs
    ),
  remove: async (
    input: GQLRemoveStoryInput
  ): Promise<Readonly<story.Story> | null> =>
    remove(ctx.mongo, ctx.tenant, input.id, input.includeComments),
  scrape: async (
    input: GQLScrapeStoryInput
  ): Promise<Readonly<story.Story> | null> =>
    scrape(ctx.mongo, ctx.tenant.id, input.id),
});
