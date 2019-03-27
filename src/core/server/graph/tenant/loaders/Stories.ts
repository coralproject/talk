import DataLoader from "dataloader";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLSTORY_STATUS,
  GQLStoryMetadata,
  QueryToStoriesArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Connection } from "talk-server/models/helpers/connection";
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
    (inputs: FindOrCreateStoryInput[]) =>
      Promise.all(
        inputs.map(input =>
          findOrCreate(ctx.mongo, ctx.tenant, input, ctx.scraperQueue, ctx.now)
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
  debugScrapeMetadata: new DataLoader<string, GQLStoryMetadata | null>(urls =>
    Promise.all(urls.map(url => scraper.scrape(url)))
  ),
});
