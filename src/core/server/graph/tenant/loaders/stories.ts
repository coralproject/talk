import DataLoader from "dataloader";

import TenantContext from "talk-server/graph/tenant/context";
import { GQLStoryMetadata } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  FindOrCreateStoryInput,
  retrieveManyStories,
  Story,
} from "talk-server/models/story";
import { scraper } from "talk-server/services/queue/tasks/scraper";
import { findOrCreate } from "talk-server/services/stories";

export default (ctx: TenantContext) => ({
  findOrCreate: (input: FindOrCreateStoryInput) =>
    findOrCreate(ctx.mongo, ctx.tenant, input, ctx.queue.scraper),
  story: new DataLoader<string, Story | null>(ids =>
    retrieveManyStories(ctx.mongo, ctx.tenant.id, ids)
  ),
  debugScrapeMetadata: new DataLoader<string, GQLStoryMetadata | null>(urls =>
    Promise.all(urls.map(url => scraper.scrape(url)))
  ),
});
