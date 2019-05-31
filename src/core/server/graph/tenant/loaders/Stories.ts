import DataLoader from "dataloader";

import TenantContext from "coral-server/graph/tenant/context";
import {
  GQLSTORY_STATUS,
  QueryToStoriesArgs,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { Connection } from "coral-server/models/helpers/connection";
import {
  retrieveManyStories,
  retrieveStoryConnection,
  Story,
  StoryConnectionInput,
} from "coral-server/models/story";
import {
  find,
  findOrCreate,
  FindOrCreateStory,
  FindStory,
} from "coral-server/services/stories";
import { scraper } from "coral-server/services/stories/scraper";

import { createManyBatchLoadFn } from "./util";

const statusFilter = (
  status?: GQLSTORY_STATUS
): StoryConnectionInput["filter"] => {
  switch (status) {
    case GQLSTORY_STATUS.OPEN:
      return {
        closedAt: { $in: [null, false] },
      };
    case GQLSTORY_STATUS.CLOSED:
      return {
        closedAt: { $lte: new Date() },
      };
    default:
      return {};
  }
};

const queryFilter = (query?: string): StoryConnectionInput["filter"] => {
  if (query) {
    return { $text: { $search: query } };
  }

  return {};
};

/**
 * primeStoriesFromConnection will prime a given context with the stories
 * retrieved via a connection.
 *
 * @param ctx graph context to use to prime the loaders.
 */
const primeStoriesFromConnection = (ctx: TenantContext) => (
  connection: Readonly<Connection<Readonly<Story>>>
) => {
  // For each of these nodes, prime the story loader.
  connection.nodes.forEach(story => {
    ctx.loaders.Stories.story.prime(story.id, story);
  });

  return connection;
};

export default (ctx: TenantContext) => ({
  findOrCreate: new DataLoader(
    createManyBatchLoadFn((input: FindOrCreateStory) =>
      findOrCreate(ctx.mongo, ctx.tenant, input, ctx.scraperQueue, ctx.now)
    ),
    {
      // TODO: (wyattjoh) see if there's something we can do to improve the cache key
      cacheKeyFn: (input: FindOrCreateStory) => `${input.id}:${input.url}`,
    }
  ),
  find: new DataLoader(
    createManyBatchLoadFn((input: FindStory) =>
      find(ctx.mongo, ctx.tenant, input)
    ),
    {
      // TODO: (wyattjoh) see if there's something we can do to improve the cache key
      cacheKeyFn: (input: FindStory) => `${input.id}:${input.url}`,
    }
  ),
  story: new DataLoader<string, Story | null>(ids =>
    retrieveManyStories(ctx.mongo, ctx.tenant.id, ids)
  ),
  connection: ({ first = 10, after, status, query }: QueryToStoriesArgs) =>
    retrieveStoryConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      filter: {
        // Merge the status filter into the connection filter.
        ...statusFilter(status),

        // Merge the query filters into the query.
        ...queryFilter(query),
      },
    }).then(primeStoriesFromConnection(ctx)),
  debugScrapeMetadata: new DataLoader(
    createManyBatchLoadFn((url: string) => scraper.scrape(url))
  ),
});
