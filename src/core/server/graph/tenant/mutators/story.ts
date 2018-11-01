import { isNull, omitBy } from "lodash";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateStoryInput,
  GQLMergeStoriesInput,
  GQLRemoveStoryInput,
  GQLScrapeStoryInput,
  GQLUpdateStoryInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Story } from "talk-server/models/story";
import { create, remove, update } from "talk-server/services/stories";
import { scrape } from "talk-server/services/stories/scraper";

export default (ctx: TenantContext) => ({
  create: async (input: GQLCreateStoryInput): Promise<Readonly<Story> | null> =>
    create(ctx.mongo, ctx.tenant, {
      id: input.story.id,
      url: input.story.url,
      metadata: input.story.metadata
        ? omitBy(input.story.metadata, isNull)
        : {},
    }),
  update: async (input: GQLUpdateStoryInput): Promise<Readonly<Story> | null> =>
    update(ctx.mongo, ctx.tenant, input.id, omitBy(input.story, isNull)),
  merge: async (input: GQLMergeStoriesInput): Promise<Readonly<Story> | null> =>
    // FIXME: implement
    null,
  remove: async (input: GQLRemoveStoryInput): Promise<Readonly<Story> | null> =>
    remove(ctx.mongo, ctx.tenant, input.id, input.includeComments),
  scrape: async (input: GQLScrapeStoryInput): Promise<Readonly<Story> | null> =>
    scrape(ctx.mongo, ctx.tenant.id, input.id),
});
