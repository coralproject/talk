import { getTextHTML } from "coral-server/app/handlers";
import { get, getCountRedisCacheKey } from "coral-server/app/middleware/cache";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { EncodedCommentActionCounts } from "coral-server/models/action/comment";
import {
  calculateTotalPublishedCommentCount,
  Comment,
  CommentModerationQueueCounts,
  CommentStatusCounts,
  CommentTagCounts,
  updateSharedCommentCounts,
} from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { CommentTag } from "coral-server/models/comment/tag";
import { updateSiteCounts } from "coral-server/models/site";
import { Story, updateStoryCounts } from "coral-server/models/story";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";
import { updateUserCommentCounts } from "coral-server/models/user";
import {
  calculateCounts,
  calculateCountsDiff,
} from "coral-server/services/comments/moderation";
import { I18n } from "coral-server/services/i18n";
import { AugmentedRedis } from "coral-server/services/redis";

import { COUNTS_V2_CACHE_DURATION } from "coral-common/common/lib/constants";
import {
  GQLCommentTagCounts,
  GQLFEATURE_FLAG,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

interface UpdateAllCommentCountsInput {
  tenant: Readonly<Tenant>;
  after: Readonly<Comment>;

  /**
   * actionCounts when provided will increment the related entries for an
   * operation that creates actions.
   */
  actionCounts: Readonly<EncodedCommentActionCounts>;

  /**
   * before when provided is used when a comment has been changed. A comment
   * that has just been created should not provide before.
   */
  before?: Readonly<Comment>;
}

function calculateModerationQueue(
  input: UpdateAllCommentCountsInput
): CommentModerationQueueCounts {
  if (input.before) {
    return calculateCountsDiff(input.before, input.after);
  }

  return calculateCounts(input.after);
}

function calculateStatus(
  input: UpdateAllCommentCountsInput
): Partial<CommentStatusCounts> {
  if (input.before) {
    if (input.before.status !== input.after.status) {
      return {
        [input.before.status]: -1,
        [input.after.status]: 1,
      };
    }

    return {};
  }

  return {
    [input.after.status]: 1,
  };
}

const tagChanged = (
  before: CommentTag[] | null | undefined,
  after: CommentTag[],
  tag: GQLTAG
) => {
  const afterTag = after.find((t: CommentTag) => t.type === tag);

  // If we don't have a before, then this is a new comment and the
  // result will be that any new tags, if present are to be incremented
  // to the totals on the story
  if (!before && after.find((t: CommentTag) => t.type === tag)) {
    return 1;
  }

  const beforeTag = before?.find((t: CommentTag) => t.type === tag);

  if (beforeTag && !afterTag) {
    return -1;
  }
  if (beforeTag && afterTag) {
    return 0;
  }
  if (!beforeTag && afterTag) {
    return 1;
  }

  return 0;
};

export const calculateTags = (
  before: CommentTag[] | null | undefined,
  after: CommentTag[]
): CommentTagCounts => {
  const tags: GQLCommentTagCounts = {
    [GQLTAG.ADMIN]: tagChanged(before, after, GQLTAG.ADMIN),
    [GQLTAG.EXPERT]: tagChanged(before, after, GQLTAG.EXPERT),
    [GQLTAG.FEATURED]: tagChanged(before, after, GQLTAG.FEATURED),
    [GQLTAG.MEMBER]: tagChanged(before, after, GQLTAG.MEMBER),
    [GQLTAG.MODERATOR]: tagChanged(before, after, GQLTAG.MODERATOR),
    [GQLTAG.QUESTION]: tagChanged(before, after, GQLTAG.QUESTION),
    [GQLTAG.REVIEW]: tagChanged(before, after, GQLTAG.REVIEW),
    [GQLTAG.STAFF]: tagChanged(before, after, GQLTAG.STAFF),
    [GQLTAG.UNANSWERED]: tagChanged(before, after, GQLTAG.UNANSWERED),
  };

  let total = 0;
  for (const [, value] of Object.entries(tags)) {
    total += value;
  }

  return {
    total,
    tags,
  };
};

interface UpdateAllCommentCountsOptions {
  updateStory?: boolean;
  updateSite?: boolean;
  updateUser?: boolean;
  updateShared?: boolean;
}

export default async function updateAllCommentCounts(
  mongo: MongoContext,
  redis: AugmentedRedis,
  config: Config,
  i18n: I18n,
  input: UpdateAllCommentCountsInput,
  options: UpdateAllCommentCountsOptions = {
    updateStory: true,
    updateSite: true,
    updateUser: true,
    updateShared: true,
  }
) {
  // Compute the queue difference as a result of the old status and the new
  // status and the action counts.
  const moderationQueue = calculateModerationQueue(input);

  // Compute the status changes as a result of the change to the comment status.
  const status = calculateStatus(input);

  const tags = calculateTags(input.before?.tags, input.after.tags);

  // Pull out some params from the input for easier usage.
  const {
    tenant,
    actionCounts: action,
    after: { storyID, authorID, siteID },
  } = input;

  if (options.updateStory) {
    // Update the story, site, and user comment counts.
    const updatedStory = (await updateStoryCounts(mongo, tenant.id, storyID, {
      action,
      status,
      moderationQueue,
      tags,
    })) as Readonly<Story> | null;

    // only update Redis cache for comment counts if jsonp_response_cache set to true
    if (config.get("jsonp_response_cache")) {
      if (updatedStory) {
        const totalCount = calculateTotalPublishedCommentCount(
          updatedStory.commentCounts.status
        );

        const key = getCountRedisCacheKey(updatedStory.url);
        if (key) {
          const ttl = config.get("jsonp_cache_max_age");
          const entry = await get(redis, ttl, key);
          if (entry) {
            const { body } = entry;

            // update count and textHtml in jsonp data with new total comment count
            // and matching localized textHtml
            const bodyArr = body.split(",");
            for (let i = 0; i < bodyArr.length; i++) {
              if (bodyArr[i].startsWith('"count":')) {
                bodyArr[i] = `"count":${totalCount}`;
              }
              if (bodyArr[i].startsWith('"textHtml":')) {
                const textHtml = getTextHTML(
                  tenant,
                  updatedStory.settings.mode,
                  i18n,
                  totalCount
                );
                bodyArr[i] = `"textHtml":"${textHtml.replace(/"/g, '\\"')}"`;
              }
            }
            const updatedEntry = {
              ...entry,
              body: bodyArr.join(","),
            };

            // set updated entry with new total comment count in Redis cache
            void redis.set(key, JSON.stringify(updatedEntry));
          }
        }
      }
    }

    if (hasFeatureFlag(tenant, GQLFEATURE_FLAG.COUNTS_V2)) {
      if (updatedStory) {
        const totalCount = calculateTotalPublishedCommentCount(
          updatedStory.commentCounts.status
        );
        if (PUBLISHED_STATUSES.includes(input.after.status)) {
          const key = `${tenant.id}:${storyID}:count`;

          // set/update the count
          await redis.set(key, totalCount, "EX", COUNTS_V2_CACHE_DURATION);
        }
      }
    }
  }

  if (options.updateSite) {
    await updateSiteCounts(mongo, tenant.id, siteID!, {
      action,
      status,
      moderationQueue,
      tags,
    });
  }

  if (options.updateUser && authorID) {
    await updateUserCommentCounts(mongo, tenant.id, authorID, {
      status,
    });
  }

  if (options.updateShared) {
    // Update the shared counts.
    await updateSharedCommentCounts(redis, tenant.id, {
      action,
      status,
      moderationQueue,
      tags,
    });
  }

  return {
    action,
    status,
    moderationQueue,
  };
}

export async function updateTagCommentCounts(
  tenantID: string,
  storyID: string,
  siteID: string,
  mongo: MongoContext,
  redis: AugmentedRedis,
  before: CommentTag[] | null | undefined,
  after: CommentTag[]
) {
  const tags = calculateTags(before, after);

  // Update the story, site, and user comment counts.
  await updateStoryCounts(mongo, tenantID, storyID, {
    action: {},
    status: {},
    moderationQueue: {
      total: 0,
      queues: {},
    },
    tags,
  });

  await updateSiteCounts(mongo, tenantID, siteID, {
    action: {},
    status: {},
    moderationQueue: {
      total: 0,
      queues: {},
    },
    tags,
  });

  // Update the shared counts.
  await updateSharedCommentCounts(redis, tenantID, {
    action: {},
    status: {},
    moderationQueue: {
      total: 0,
      queues: {},
    },
    tags,
  });
}
