import { QueueOptions } from "bull";

import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import Task, { JobProcessor } from "coral-server/queue/Task";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

const JOB_NAME = "loadCache";

export interface LoadCacheProcessorOptions {
  mongo: MongoContext;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
}

export interface LoadCacheData {
  tenantID: string;
  storyID: string;
}

const createJobProcessor =
  ({
    mongo,
    redis,
    tenantCache,
  }: LoadCacheProcessorOptions): JobProcessor<LoadCacheData> =>
  async (job) => {
    const { storyID, tenantID } = job.data;
    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        storyID,
        tenantID,
      },
      true
    );

    const timer = createTimer();
    const { comments, users } = new DataCache(mongo, redis, null, log);

    log.info("attempting to load story into redis cache");

    // Get the tenant.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    const story = await mongo.stories().findOne({ tenantID, id: storyID });
    if (!story) {
      log.error("story not found");
      return;
    }

    log.info("found story, proceeding with cache loading");

    const isArchived = !!(story.isArchived || story.isArchiving);
    const { userIDs } = await comments.populateCommentsInCache(
      tenantID,
      storyID,
      isArchived,
      new Date()
    );

    if (userIDs.length > 0) {
      await users.populateUsers(tenantID, userIDs);
    }

    log.info({ took: timer() }, "cache load operation ended");
  };

export type LoadCacheQueue = Task<LoadCacheData>;

export function createLoadCacheTask(
  queue: QueueOptions,
  options: LoadCacheProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
    jobIdGenerator: ({ tenantID, storyID }) => `${tenantID}:${storyID}`,
    attempts: 1,
  });
}
