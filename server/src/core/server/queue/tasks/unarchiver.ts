import { QueueOptions } from "bull";

import { MongoContext } from "coral-server/data/context";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { retrieveStoryToBeUnarchived } from "coral-server/models/story";
import Task, { JobProcessor } from "coral-server/queue/Task";
import { unarchiveStory } from "coral-server/services/archive";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

const JOB_NAME = "unarchiver";

export interface UnarchiverProcessorOptions {
  mongo: MongoContext;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
}

export interface UnarchiverData {
  tenantID: string;
  storyID: string;
}

const createJobProcessor = ({
  mongo,
  redis,
  tenantCache,
}: UnarchiverProcessorOptions): JobProcessor<UnarchiverData> => {
  return async (job) => {
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

    log.info("attempting to unarchive story");

    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    const now = new Date();

    const story = await retrieveStoryToBeUnarchived(
      mongo,
      tenantID,
      storyID,
      now
    );
    if (!story) {
      log.warn(
        { storyID },
        "unarchiver was unable to lock story for unarchiving"
      );
      return;
    }

    log.info({ storyID }, "found story, proceeding with unarchiving");

    const result = await unarchiveStory(
      mongo,
      redis,
      tenant.id,
      story.id,
      log,
      now
    );

    if (!result?.isArchived && !result?.isArchiving) {
      log.info({ storyID }, "successfully unarchived story");
    } else {
      log.error({ storyID }, "unable to unarchive story");
      throw new Error("unable to unarchive story");
    }

    log.debug({ took: timer() }, "attempted unarchive operation ended");
  };
};

export type UnarchiverQueue = Task<UnarchiverData>;

export function createUnarchiverTask(
  queue: QueueOptions,
  options: UnarchiverProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
    jobIdGenerator: ({ tenantID, storyID }) =>
      `${tenantID}:${storyID}:unarchive`,
    attempts: 1,
  });
}
