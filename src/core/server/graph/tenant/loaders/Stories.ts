import DataLoader from "dataloader";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLSTORY_STATUS,
  GQLStoryMetadata,
  QueryToStoriesArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  FindOrCreateStoryInput,
  retrieveManyStories,
  retrieveStoryConnection,
  Story,
  StoryConnectionInput,
} from "talk-server/models/story";
import { findOrCreate } from "talk-server/services/stories";
import { scraper } from "talk-server/services/stories/scraper";

const statusFilter = (
  status?: GQLSTORY_STATUS
): StoryConnectionInput["filter"] => {
  switch (status) {
    case GQLSTORY_STATUS.OPEN:
      return {
        closedAt: null,
      };
    case GQLSTORY_STATUS.CLOSED:
      return {
        closedAt: { $lte: new Date() },
      };
    default:
      return {};
  }
};

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
  connection: ({ first = 10, after, status }: QueryToStoriesArgs) =>
    retrieveStoryConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      filter: {
        // Merge the status filter into the connection filter.
        ...statusFilter(status),
      },
    }),
  debugScrapeMetadata: new DataLoader<string, GQLStoryMetadata | null>(urls =>
    Promise.all(urls.map(url => scraper.scrape(url)))
  ),
});
