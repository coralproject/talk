import DataLoader from "dataloader";
import { defaultTo } from "lodash";
import { DateTime } from "luxon";

import GraphContext from "coral-server/graph/context";
import {
  retrieveAuthorStoryRating,
  retrieveManyStoryRatings,
  retrieveOngoingDiscussions,
} from "coral-server/models/comment";
import { retrieveTopStoryMetrics } from "coral-server/models/comment/metrics";
import { Connection } from "coral-server/models/helpers";
import { CloseCommenting } from "coral-server/models/settings";
import {
  retrieveActiveStories,
  retrieveManyStories,
  retrieveStoryConnection,
  Story,
  STORY_SORT,
  StoryConnectionInput,
} from "coral-server/models/story";
import { countStoryViewers } from "coral-server/models/story/viewers";
import {
  find,
  findOrCreate,
  FindOrCreateStory,
  FindStory,
  retrieveSections,
} from "coral-server/services/stories";
import { scraper } from "coral-server/services/stories/scraper";

import {
  GQLSTORY_STATUS,
  QueryToStoriesArgs,
  SiteToTopStoriesArgs,
  UserToOngoingDiscussionsArgs,
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

const siteFilter = (siteIDs?: string[]): StoryConnectionInput["filter"] => {
  if (siteIDs) {
    return {
      siteID: { $in: siteIDs },
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
const primeStoriesFromConnection =
  (ctx: GraphContext) =>
  (connection: Readonly<Connection<Readonly<Story>>>) => {
    if (!ctx.disableCaching) {
      // For each of these nodes, prime the story loader.
      connection.nodes.forEach((story) => {
        ctx.loaders.Stories.story.prime(story.id, story);
      });
    }

    return connection;
  };

const primeStory =
  (ctx: GraphContext) =>
  (story: Readonly<Story> | null): Readonly<Story> | null => {
    if (story) {
      ctx.loaders.Stories.story.prime(story.id, story);
    }

    return story;
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
      ).then(primeStory(ctx))
    ),
    {
      cacheKeyFn: (input: FindStory) => (input.id ? input.id : input.url),
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  find: new DataLoader(
    createManyBatchLoadFn((input: FindStory) =>
      find(ctx.mongo, ctx.tenant, input).then(primeStory(ctx))
    ),
    {
      cacheKeyFn: (input: FindStory) => (input.id ? input.id : input.url),
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  sections: () => retrieveSections(ctx.mongo, ctx.tenant),
  story: new DataLoader<string, Story | null>(
    (ids) => retrieveManyStories(ctx.mongo, ctx.tenant.id, ids),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  connection: ({ first, after, status, query, siteIDs }: QueryToStoriesArgs) =>
    retrieveStoryConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      orderBy: query ? STORY_SORT.TEXT_SCORE : STORY_SORT.CREATED_AT_DESC,
      filter: {
        // Merge the site filter into the connection filter.
        ...siteFilter(siteIDs),
        // Merge the status filter into the connection filter.
        ...statusFilter(ctx.tenant.closeCommenting, status, ctx.now),
        // Merge the query filters into the query.
        ...queryFilter(query),
      },
    }).then(primeStoriesFromConnection(ctx)),
  topStories: (siteID: string, { limit }: SiteToTopStoriesArgs) => {
    // Find top active stories in the last 24 hours.
    const start = DateTime.fromJSDate(ctx.now).minus({ hours: 24 }).toJSDate();

    return retrieveTopStoryMetrics(
      ctx.mongo,
      ctx.tenant.id,
      siteID,
      defaultTo(limit, 5),
      start,
      ctx.now
    );
  },
  viewerRating: (storyID: string) =>
    ctx.user
      ? retrieveAuthorStoryRating(
          ctx.mongo,
          ctx.tenant.id,
          storyID,
          ctx.user.id
        )
      : null,
  viewerCount: (siteID: string, storyID: string) =>
    countStoryViewers(
      ctx.redis,
      {
        tenantID: ctx.tenant.id,
        siteID,
        storyID,
      },
      ctx.config.get("story_viewer_timeout")
    ),
  ratings: new DataLoader((storyIDs: string[]) =>
    retrieveManyStoryRatings(ctx.mongo, ctx.tenant.id, storyIDs)
  ),
  ongoingDiscussions: (
    authorID: string,
    { limit }: UserToOngoingDiscussionsArgs
  ) =>
    retrieveOngoingDiscussions(
      ctx.mongo,
      ctx.tenant.id,
      authorID,
      defaultTo(limit, 5)
    ),
  debugScrapeMetadata: new DataLoader(
    createManyBatchLoadFn((url: string) =>
      scraper.scrape({
        url,
        timeout: ctx.config.get("scrape_timeout"),
        size: ctx.config.get("scrape_max_response_size"),
        customUserAgent: ctx.tenant.stories.scraping.customUserAgent,
        proxyURL: ctx.tenant.stories.scraping.proxyURL,
      })
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
