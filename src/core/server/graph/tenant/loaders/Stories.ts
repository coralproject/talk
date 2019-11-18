import DataLoader from "dataloader";
import { defaultTo, isNull } from "lodash";

import TenantContext from "coral-server/graph/tenant/context";
import { Community } from "coral-server/models/community";
import { Connection } from "coral-server/models/helpers";
import { Settings } from "coral-server/models/settings";
import { Site } from "coral-server/models/site";
import {
  retrieveConsolidatedSettings,
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

import {
  GQLSTORY_STATUS,
  QueryToStoriesArgs,
} from "coral-server/graph/tenant/schema/__generated__/types";

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
  if (!ctx.disableCaching) {
    // For each of these nodes, prime the story loader.
    connection.nodes.forEach(story => {
      ctx.loaders.Stories.story.prime(story.id, story);
    });
  }

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
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  find: new DataLoader(
    createManyBatchLoadFn((input: FindStory) =>
      find(ctx.mongo, ctx.tenant, input)
    ),
    {
      // TODO: (wyattjoh) see if there's something we can do to improve the cache key
      cacheKeyFn: (input: FindStory) => `${input.id}:${input.url}`,
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  story: new DataLoader<string, Story | null>(
    ids => retrieveManyStories(ctx.mongo, ctx.tenant.id, ids),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  settings: new DataLoader<string, Settings | null>(async ids => {
    const stories = await ctx.loaders.Stories.story.loadMany(ids);
    const filteredStories = stories.filter(
      (s: Story | null) => !isNull(s)
    ) as Story[];
    const sites = await ctx.loaders.Sites.site.loadMany(
      filteredStories.map(s => s.siteID)
    );
    const filteredSites = sites.filter(
      (s: Site | null) => !isNull(s)
    ) as Site[];
    const communities = await ctx.loaders.Communities.community.loadMany(
      filteredSites.map(s => s.communityID)
    );
    const filteredCommunities = communities.filter(
      (c: Community | null) => !isNull(c)
    ) as Community[];
    return Promise.resolve(
      ids.map(id => {
        const story = filteredStories.find(s => s.id === id);
        if (!story) {
          return null;
        }
        const site = filteredSites.find(s => s.id === story.siteID);
        if (!site) {
          return null;
        }
        const community = filteredCommunities.find(
          c => c.id === site.communityID
        );
        if (!community) {
          return null;
        }
        return retrieveConsolidatedSettings(ctx.tenant, community, site, story);
      })
    );
  }),
  connection: ({ first, after, status, query }: QueryToStoriesArgs) =>
    retrieveStoryConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter: {
        // Merge the status filter into the connection filter.
        ...statusFilter(status),

        // Merge the query filters into the query.
        ...queryFilter(query),
      },
    }).then(primeStoriesFromConnection(ctx)),
  debugScrapeMetadata: new DataLoader(
    createManyBatchLoadFn((url: string) =>
      // This typecast is needed because the custom `ms` format does not return
      // the desired `number` type even though that's the only type it can
      // output.
      scraper.scrape(url, (ctx.config.get(
        "scrape_timeout"
      ) as unknown) as number)
    ),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
});
