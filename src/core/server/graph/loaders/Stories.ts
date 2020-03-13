import DataLoader from "dataloader";
import { defaultTo } from "lodash";
import { DateTime } from "luxon";

import GraphContext from "coral-server/graph/context";
import { Connection } from "coral-server/models/helpers";
import { CloseCommenting } from "coral-server/models/settings";
import {
  retrieveActiveStories,
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
} from "coral-server/graph/schema/__generated__/types";

import { createManyBatchLoadFn } from "./util";

const statusFilter = (
  closeCommenting: CloseCommenting,
  status?: GQLSTORY_STATUS,
  now = new Date()
): StoryConnectionInput["filter"] => {
  switch (status) {
    case GQLSTORY_STATUS.OPEN:
      if (closeCommenting.auto) {
        // Automatic story closing has been enabled. Stories will be considered
        // open if they have a ${closedAt} date in the future, if they've been
        // forced open (where ${closedAt} is set to false), or they haven't been
        // closed and their ${createdAt} date is after ${now - close.timeout}.

        // Calculate the cutoff time for createdAt.
        const consideredClosedAt = DateTime.fromJSDate(now)
          .plus({
            seconds: -closeCommenting.timeout,
          })
          .toJSDate();

        return {
          $or: [
            // The story will be open if the close date is in the future...
            {
              closedAt: { $gt: now },
            },
            // Or the story has been forced open by setting closedAt to false...
            {
              closedAt: false,
            },
            // Or the closed at date isn't set and the createdAt date is after
            // the cutoff date.
            {
              closedAt: null,
              createdAt: { $gt: consideredClosedAt },
            },
          ],
        };
      }

      // Automatic story closing is not enabled. Stories will be considered open
      // if they do not have a ${closedAt}, it has been forced open (where
      // ${closedAt} is set to false), or the ${closedAt} date is in the future.
      return {
        $or: [
          // A story is open if the closedAt date is in the future...
          { closedAt: { $gt: now } },
          // Or the closedAt date is not set.
          { closedAt: { $in: [null, false] } },
        ],
      };
    case GQLSTORY_STATUS.CLOSED:
      if (closeCommenting.auto) {
        // Automatic story closing has been enabled. Stories will be considered
        // closed if they have a ${closedAt} date before the current date or
        // they do not have a ${closedAt} date set and the ${createdAt} date is
        // before ${now - close.timeout} (implying that it's close window is
        // up).

        // Calculate the cutoff time for createdAt.
        const consideredClosedAt = DateTime.fromJSDate(now)
          .plus({
            seconds: -closeCommenting.timeout,
          })
          .toJSDate();

        return {
          $or: [
            // The story will be closed if the closedAt date is in the past...
            { closedAt: { $lte: now } },
            // Or the closedAt date isn't set and the createdAt date is before
            // the cutoff date.
            {
              closedAt: null,
              createdAt: { $lte: consideredClosedAt },
            },
          ],
        };
      }

      // Automatic story closing is not enabled. Stories will be considered
      // closed if the ${closedAt} date is before ${now}.
      return {
        closedAt: { $lte: now },
      };
    default:
      return {};
  }
};

const siteFilter = (siteID?: string): StoryConnectionInput["filter"] => {
  if (siteID) {
    return {
      siteID,
    };
  }
  return {};
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
const primeStoriesFromConnection = (ctx: GraphContext) => (
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

export default (ctx: GraphContext) => ({
  findOrCreate: new DataLoader(
    createManyBatchLoadFn((input: FindOrCreateStory) =>
      findOrCreate(
        ctx.mongo,
        ctx.tenant,
        ctx.broker,
        input,
        ctx.scraperQueue,
        ctx.now
      )
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
  connection: ({ first, after, status, query, siteID }: QueryToStoriesArgs) =>
    retrieveStoryConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter: {
        // Merge the site filter into the connection filter.
        ...siteFilter(siteID),
        // Merge the status filter into the connection filter.
        ...statusFilter(ctx.tenant.closeCommenting, status, ctx.now),
        // Merge the query filters into the query.
        ...queryFilter(query),
      },
    }).then(primeStoriesFromConnection(ctx)),
  debugScrapeMetadata: new DataLoader(
    createManyBatchLoadFn((url: string) =>
      // This typecast is needed because the custom `ms` format does not return
      // the desired `number` type even though that's the only type it can
      // output.
      scraper.scrape(
        url,
        (ctx.config.get("scrape_timeout") as unknown) as number,
        ctx.tenant.stories.scraping.customUserAgent,
        ctx.tenant.stories.scraping.proxyURL
      )
    ),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  activeStories: (limit: number) =>
    retrieveActiveStories(ctx.mongo, ctx.tenant.id, limit),
});
