import { flattenDeep, identity, isEmpty, pickBy } from "lodash";
import { Db } from "mongodb";
import ms from "ms";

import logger from "talk-server/logger";
import { EncodedCommentActionCounts } from "talk-server/models/action/comment";
import { Story } from "talk-server/models/story";
import {
  CommentModerationCountsPerQueue,
  CommentStatusCounts,
  StoryCounts,
} from "talk-server/models/story/counts";
import { AugmentedPipeline, AugmentedRedis } from "talk-server/services/redis";

import {
  createEmptyCommentModerationCountsPerQueue,
  createEmptyCommentModerationQueueCounts,
  createEmptyCommentStatusCounts,
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
 * collection provides a reference to the stories collection used by the
 * counting system.
 */
function collection<T = Story>(mongo: Db) {
  return mongo.collection<Readonly<T>>("stories");
}

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
  const queueResults = await collection<{
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

  // Increment the hash key values.
  const pipeline = redis.pipeline();

  // Mark the key as fresh, and update the values!
  pipeline.mhincrby(
    key,
    ...queues.reduce((acc, queue) => [...acc, queue._id, queue.total], [])
  );
  pipeline.set(freshKey, now.getTime(), "EX", COUNT_FRESHNESS_EXPIRY_SECONDS);

  await pipeline.exec();

  const queueCounts: CommentModerationCountsPerQueue = queues.reduce(
    (acc, queue) => ({
      ...acc,
      [queue._id]: queue.total,
    }),
    createEmptyCommentModerationQueueCounts().queues
  );

  return queueCounts;
}

/**
 * recalculateSharedModerationQueueTotalCounts will reset the counts stored for
 * this Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the tenant ID that we are resetting the counts for
 */
export async function recalculateSharedModerationQueueTotalCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
) {
  const key = commentCountsModerationQueueTotalKey(tenantID);
  const freshKey = freshenKey(key);

  // Clear the existing cached queues.
  await redis.del(key, freshKey);

  // Fetch all the totals for the moderation queues.
  const totalResults = await collection<{
    total: number;
  }>(mongo).aggregate([
    {
      $match: { tenantID, createdAt: { $lt: now } },
    },
    {
      $group: {
        _id: "total",
        total: {
          $sum: "$commentCounts.moderationQueue.total",
        },
      },
    },
  ]);

  const totals = await totalResults.toArray();
  if (totals.length !== 1) {
    throw new Error("total results returned incorrect");
  }

  const [{ total }] = totals;

  // Mark the key as fresh, and update the values!
  const pipeline = redis.pipeline();

  pipeline.incrby(key, total);
  pipeline.set(freshKey, now.getTime(), "EX", COUNT_FRESHNESS_EXPIRY_SECONDS);

  await pipeline.exec();

  return total;
}

/**
 * recalculateSharedStatusCommentCounts will reset the counts stored for this
 * Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the tenant ID that we are resetting the counts for
 */
export async function recalculateSharedStatusCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
) {
  const key = commentCountsStatusKey(tenantID);
  const freshKey = freshenKey(key);

  // Clear the existing cached queues.
  await redis.del(key, freshKey);

  // Fetch all the comments of each status.
  const statusResults = await collection<{
    _id: string;
    total: number;
  }>(mongo).aggregate([
    {
      $match: { tenantID, createdAt: { $lt: now } },
    },
    {
      $project: {
        status: {
          $objectToArray: "$commentCounts.status",
        },
      },
    },
    {
      $unwind: "$status",
    },
    {
      $group: {
        _id: "$status.k",
        total: {
          $sum: "$status.v",
        },
      },
    },
  ]);

  // Convert the cursor from the results into an array.
  const statuses = await statusResults.toArray();

  // Mark the key as fresh, and update the values!
  const pipeline = redis.pipeline();

  pipeline.mhincrby(
    key,
    ...statuses.reduce((acc, status) => [...acc, status._id, status.total], [])
  );
  pipeline.set(freshKey, now.getTime(), "EX", COUNT_FRESHNESS_EXPIRY_SECONDS);

  await pipeline.exec();

  // Now, reconstruct the status counts so we can return it.
  const statusCounts: CommentStatusCounts = statuses.reduce(
    (acc, status) => ({
      ...acc,
      [status._id]: status.total,
    }),
    createEmptyCommentStatusCounts()
  );

  return statusCounts;
}

/**
 * recalculateSharedActionCommentCounts will reset the counts stored for this
 * Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the tenant ID that we are resetting the counts for
 */
export async function recalculateSharedActionCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
) {
  const key = commentCountsActionKey(tenantID);
  const freshKey = freshenKey(key);

  // Clear the existing cached queues.
  await redis.del(key, freshKey);

  // Fetch all the comments of each status.
  const actionResults = await collection<{
    _id: string;
    total: number;
  }>(mongo).aggregate([
    {
      $match: { tenantID, createdAt: { $lt: now } },
    },
    {
      $project: {
        status: {
          $objectToArray: "$commentCounts.status",
        },
      },
    },
    {
      $unwind: "$status",
    },
    {
      $group: {
        _id: "$status.k",
        total: {
          $sum: "$status.v",
        },
      },
    },
  ]);

  // Convert the cursor from the results into an array.
  const actions = await actionResults.toArray();

  // Mark the key as fresh, and update the values!
  const pipeline = redis.pipeline();

  pipeline.mhincrby(
    key,
    ...actions.reduce((acc, action) => [...acc, action._id, action.total], [])
  );
  pipeline.set(freshKey, now.getTime(), "EX", COUNT_FRESHNESS_EXPIRY_SECONDS);

  await pipeline.exec();

  // Now, compile the action counts into EncodedActionCounts.
  const actionCounts: EncodedCommentActionCounts = actions.reduce(
    (acc, action) => ({
      ...acc,
      [action._id]: action.total,
    }),
    {}
  );

  return actionCounts;
}

/**
 * recalculateSharedCommentCounts will reset the counts stored for this
 * Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the tenant ID that we are resetting the counts for
 */
export async function recalculateSharedCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
) {
  await Promise.all([
    recalculateSharedModerationQueueQueueCounts(mongo, redis, tenantID, now),
    recalculateSharedModerationQueueTotalCounts(mongo, redis, tenantID, now),
    recalculateSharedStatusCommentCounts(mongo, redis, tenantID, now),
    recalculateSharedActionCommentCounts(mongo, redis, tenantID, now),
  ]);
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
 * retrieveSharedActionCommentCounts will retrieve the comment counts based on
 * actions for this Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the ID of the Tenant that we are getting the shared action
 *                 counts from
 */
export async function retrieveSharedActionCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
): Promise<EncodedCommentActionCounts> {
  const key = commentCountsActionKey(tenantID);
  const freshKey = freshenKey(key);

  // Get the values, and the freshness key.
  const [[, actions], [, fresh]]: [
    [Error | undefined, Record<string, string> | null],
    [Error | undefined, string | null]
  ] = await redis
    .pipeline()
    .hgetall(key)
    .get(freshKey)
    .exec();
  if (!fresh || !actions) {
    return recalculateSharedActionCommentCounts(mongo, redis, tenantID, now);
  }

  return fillAndConvertStringToNumber(
    actions,
    {} as EncodedCommentActionCounts
  );
}

/**
 * retrieveSharedStatusCommentCounts will retrieve the comment counts based on
 * the status for this Tenant.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the ID of the Tenant that we are getting the shared status
 *                 counts from
 */
export async function retrieveSharedStatusCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
): Promise<CommentStatusCounts> {
  const key = commentCountsStatusKey(tenantID);
  const freshKey = freshenKey(key);

  // Get the values, and the freshness key.
  const [[, statuses], [, fresh]]: [
    [Error | undefined, Record<keyof CommentStatusCounts, string> | null],
    [Error | undefined, string | null]
  ] = await redis
    .pipeline()
    .hgetall(key)
    .get(freshKey)
    .exec();
  if (!fresh || !statuses) {
    return recalculateSharedStatusCommentCounts(mongo, redis, tenantID, now);
  }

  return fillAndConvertStringToNumber(
    statuses,
    createEmptyCommentStatusCounts()
  );
}

/**
 * retrieveSharedModerationQueueTotal will retrieve the count of comments in
 * this Tenant that are in need of moderation.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID the ID of the Tenant that we are getting the shared
 *                 moderation counts from
 */
export async function retrieveSharedModerationQueueTotal(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  now = new Date()
) {
  const key = commentCountsModerationQueueTotalKey(tenantID);
  const freshKey = freshenKey(key);

  // Get the values, and the freshness key.
  const [total, fresh]: [string | null, string | null] = await redis.mget(
    key,
    freshKey
  );
  if (fresh === null || total === null) {
    return recalculateSharedModerationQueueTotalCounts(
      mongo,
      redis,
      tenantID,
      now
    );
  }

  return parseInt(total, 10) || 0;
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
