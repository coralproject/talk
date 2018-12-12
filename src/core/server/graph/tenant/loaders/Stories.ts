import DataLoader from "dataloader";

import TenantContext from "talk-server/graph/tenant/context";
import { GQLStoryMetadata } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  FindOrCreateStoryInput,
  retrieveManyStories,
  Story,
} from "talk-server/models/story";
import { findOrCreate } from "talk-server/services/stories";
import { scraper } from "talk-server/services/stories/scraper";

export default (ctx: TenantContext) => ({
  findOrCreate: new DataLoader(
    (inputs: FindOrCreateStoryInput[]) =>
      Promise.all(
        inputs.map(input =>
          findOrCreate(ctx.mongo, ctx.tenant, input, ctx.queue.scraper)
        )
      ),
    {
      // TODO: (wyattjoh) see if there's something we can do to improve the cache key
      cacheKeyFn: (input: FindOrCreateStoryInput) => `${input.id}:${input.url}`,
    }
  ),
  story: new DataLoader<string, Story | null>(ids =>
    retrieveManyStories(ctx.mongo, ctx.tenant.id, ids)
  ),
  debugScrapeMetadata: new DataLoader<string, GQLStoryMetadata | null>(urls =>
    Promise.all(urls.map(url => scraper.scrape(url)))
  ),
});
