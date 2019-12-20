import { flatten, flattenDeep, identity, isEmpty, pickBy } from "lodash";
import { Db } from "mongodb";
import ms from "ms";

import logger from "coral-server/logger";
import {
  CommentModerationCountsPerQueue,
  StoryCounts,
} from "coral-server/models/story/counts";
import { stories as collection } from "coral-server/services/mongodb/collections";
import { AugmentedPipeline, AugmentedRedis } from "coral-server/services/redis";

import {
  createEmptyCommentModerationCountsPerQueue,
  createEmptyCommentModerationQueueCounts,
} from "./empty";

/**
 * COUNT_FRESHNESS_EXPIRY will expire the :fresh key for cached counts that will
 * trigger a recalculation of the cached count values after the time that it
 * last computed it plus the below time in seconds elapsed.
 */
const COUNT_FRESHNESS_EXPIRY_SECONDS = Math.floor(ms("24h") / 1000);

/**
 * shared keys
 */

const freshenKey = (key: string) => `${key}:fresh`;

const commentCountsActionKey = (tenantID: string) =>
  `${tenantID}:commentCounts:action`;

const commentCountsStatusKey = (tenantID: string) =>
  `${tenantID}:commentCounts:status`;

const commentCountsModerationQueueTotalKey = (tenantID: string) =>
  `${tenantID}:commentCounts:moderationQueue:total`;

const commentCountsModerationQueueQueuesKey = (tenantID: string) =>
  `${tenantID}:commentCounts:moderationQueue:queues`;

/**
 * recalculateSharedModerationQueueQueueCounts will reset the counts stored for
 * this Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the tenant ID that we are resetting the counts for
 */
export async function recalculateSharedModerationQueueQueueCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
) {
  const key = commentCountsModerationQueueQueuesKey(tenantID);
  const freshKey = freshenKey(key);

  // Clear the existing cached queues.
  await redis.del(key, freshKey);

  // Fetch all the moderation queue counts.
  const queueResults = collection<{
    _id: string;
    total: number;
  }>(mongo).aggregate([
    {
      $match: { tenantID, createdAt: { $lt: now } },
    },
    {
      $project: {
        moderationQueue: {
          $objectToArray: "$commentCounts.moderationQueue.queues",
        },
      },
    },
    {
      $unwind: "$moderationQueue",
    },
    {
      $group: {
        _id: "$moderationQueue.k",
        total: {
          $sum: "$moderationQueue.v",
        },
      },
    },
  ]);

  // Convert the cursor from the results into an array.
  const queues = await queueResults.toArray();

  // Convert the queue counts into a structured object with defaults.
  const queueCounts: CommentModerationCountsPerQueue = queues.reduce(
    (acc, queue) => ({
      ...acc,
      [queue._id]: queue.total,
    }),
    createEmptyCommentModerationQueueCounts().queues
  );

  // Mark the key as fresh, and update the values! We're using `HMSET` here
  // because this can still result in race conditions when the call is made
  // twice.
  await redis
    .pipeline()
    .hmset(key, ...flatten(Object.entries(queueCounts)))
    .set(freshKey, now.getTime(), "EX", COUNT_FRESHNESS_EXPIRY_SECONDS)
    .exec();

  return queueCounts;
}

function fillAndConvertStringToNumber<
  T extends { [P in keyof T]?: string } &
    { [P in Exclude<keyof T, keyof U>]?: never },
  U extends { [P in keyof U]: number }
>(input: T, initial: U): U {
  const result: U = Object.assign({}, initial);
  for (const key in input) {
    if (!input.hasOwnProperty(key)) {
      continue;
    }

    // Pull out the value.
    const value: string | undefined = input[key] as any;
    if (!value) {
      continue;
    }

    // I know, not ideal, but...
    (result as any)[key] = parseInt(value, 10) || 0;
  }

  return result;
}

/**
 * retrieveSharedModerationQueueQueuesCounts will retrieve the count of comments
 * in each moderation queue for this Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the ID of the Tenant that we are getting the shared
 *                 moderation queue counts from
 */
export async function retrieveSharedModerationQueueQueuesCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
): Promise<CommentModerationCountsPerQueue> {
  const key = commentCountsModerationQueueQueuesKey(tenantID);
  const freshKey = freshenKey(key);

  // Get the values, and the freshness key.
  const [[, queues], [, fresh]]: [
    [
      Error | undefined,
      Record<keyof CommentModerationCountsPerQueue, string> | null
    ],
    [Error | undefined, string | null]
  ] = await redis
    .pipeline()
    .hgetall(key)
    .get(freshKey)
    .exec();
  if (!fresh || !queues) {
    logger.debug({ tenantID }, "comment moderation counts were not cached");
    return recalculateSharedModerationQueueQueueCounts(
      mongo,
      redis,
      tenantID,
      now
    );
  }

  logger.debug({ tenantID }, "comment moderation counts were cached");

  return fillAndConvertStringToNumber(
    queues,
    createEmptyCommentModerationCountsPerQueue()
  );
}

export async function updateSharedCommentCounts(
  redis: AugmentedRedis,
  tenantID: string,
  commentCounts: StoryCounts
) {
  const pipeline: AugmentedPipeline = redis.pipeline();

  // HASH ${tenantID}:commentCounts:action

  const action = pickBy(commentCounts.action || {}, identity);
  if (!isEmpty(action)) {
    // Determine the arguments that we will increment.
    const args = flattenDeep(Object.entries(action));

    // Add the command to the pipeline.
    pipeline.mhincrby(commentCountsActionKey(tenantID), ...args);
  }

  // HASH ${tenantID}:commentCounts:status

  const status = pickBy(commentCounts.status || {}, identity);
  if (!isEmpty(status)) {
    // Determine the arguments that we will increment.
    const args = flattenDeep(Object.entries(status));

    // Add the command to the pipeline.
    pipeline.mhincrby(commentCountsStatusKey(tenantID), ...args);
  }

  // HASH ${tenantID}:commentCounts:moderationQueue:total

  const moderationQueue = commentCounts.moderationQueue || {};
  const moderationQueueTotal =
    typeof moderationQueue.total === "number" ? moderationQueue.total : 0;
  if (moderationQueueTotal !== 0) {
    // Add the command to the pipeline.
    pipeline.incrby(
      commentCountsModerationQueueTotalKey(tenantID),
      moderationQueueTotal
    );
  }

  // HASH ${tenantID}:commentCounts:moderationQueue:queues

  const moderationQueueQueues = pickBy(moderationQueue.queues || {}, identity);
  if (!isEmpty(moderationQueueQueues)) {
    // Determine the arguments that we will increment.
    const args = flattenDeep(Object.entries(moderationQueueQueues));

    // Add the command to the pipeline.
    pipeline.mhincrby(commentCountsModerationQueueQueuesKey(tenantID), ...args);
  }

  // Execute the pipeline.
  await pipeline.exec();
}
